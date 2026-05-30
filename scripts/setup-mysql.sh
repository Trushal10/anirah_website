#!/bin/bash
set -e

MYSQL_HOME=/home/z/mariadb-10.11.16-linux-systemd-x86_64
DATA_DIR=/home/z/mysql-data
SOCKET_DIR=/home/z/mysql-run

mkdir -p $SOCKET_DIR
rm -f $SOCKET_DIR/mysqld.sock $SOCKET_DIR/mysqld.pid

# Start MySQL in background
$MYSQL_HOME/bin/mysqld \
  --basedir=$MYSQL_HOME \
  --datadir=$DATA_DIR \
  --socket=$SOCKET_DIR/mysqld.sock \
  --port=3307 \
  --user=z \
  --skip-grant-tables \
  --skip-innodb \
  --default-storage-engine=MyISAM \
  --pid-file=$SOCKET_DIR/mysqld.pid \
  --log-error=$DATA_DIR/error.log \
  --skip-performance-schema \
  --key-buffer-size=256K \
  --max-connections=10 &

# Wait for it to be ready
for i in $(seq 1 30); do
  if [ -S "$SOCKET_DIR/mysqld.sock" ]; then
    if $MYSQL_HOME/bin/mysql -S $SOCKET_DIR/mysqld.sock -u root -e "SELECT 1" >/dev/null 2>&1; then
      echo "MySQL ready!"
      # Create database
      $MYSQL_HOME/bin/mysql -S $SOCKET_DIR/mysqld.sock -u root -e "
        CREATE DATABASE IF NOT EXISTS fundgrow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
      " 2>/dev/null
      echo "Database created!"
      
      # Push schema
      cd /home/z/my-project
      export DATABASE_URL="mysql://root:@127.0.0.1:3306/fundgrow"
      bunx prisma db push --skip-generate 2>&1
      
      echo "Schema pushed!"
      
      # Kill MySQL
      kill $(cat $SOCKET_DIR/mysqld.pid) 2>/dev/null
      echo "MySQL stopped."
      exit 0
    fi
  fi
  sleep 0.5
done

echo "TIMEOUT: MySQL failed to start"
exit 1
