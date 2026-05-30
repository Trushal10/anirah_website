#!/bin/bash
MYSQL_HOME=/home/z/mariadb-10.11.16-linux-systemd-x86_64
DATA_DIR=/home/z/mysql-data
SOCKET_DIR=/home/z/mysql-run
ERROR_LOG=$DATA_DIR/error.log

mkdir -p $SOCKET_DIR

# Check if already running
if [ -S "$SOCKET_DIR/mysqld.sock" ]; then
  echo "MySQL socket exists, checking if alive..."
  $MYSQL_HOME/bin/mysqladmin -S $SOCKET_DIR/mysqld.sock ping 2>/dev/null && echo "MySQL already running" && exit 0
  echo "Stale socket, removing..."
  rm -f $SOCKET_DIR/mysqld.sock
fi

# Clean up stale pid
if [ -f "$SOCKET_DIR/mysqld.pid" ]; then
  PID=$(cat $SOCKET_DIR/mysqld.pid)
  kill $PID 2>/dev/null
  rm -f $SOCKET_DIR/mysqld.pid
  sleep 1
fi

echo "Starting MySQL..."
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
  --log-error=$ERROR_LOG \
  --skip-performance-schema \
  --key-buffer-size=256K \
  --max-connections=10 &

# Wait for server to be ready
for i in $(seq 1 30); do
  if [ -S "$SOCKET_DIR/mysqld.sock" ]; then
    if $MYSQL_HOME/bin/mysql -S $SOCKET_DIR/mysqld.sock -u root -e "SELECT 1" >/dev/null 2>&1; then
      echo "MySQL is ready!"
      # Setup database
      $MYSQL_HOME/bin/mysql -S $SOCKET_DIR/mysqld.sock -u root -e "
        CREATE DATABASE IF NOT EXISTS fundgrow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
      " 2>/dev/null
      echo "Database 'fundgrow' is ready!"
      exit 0
    fi
  fi
  sleep 1
done

echo "Failed to start MySQL"
exit 1
