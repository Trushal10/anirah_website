#!/bin/bash
cd /home/z/my-project

MYSQL_HOME=/home/z/mariadb-10.11.16-linux-systemd-x86_64
DATA_DIR=/home/z/mysql-data
SOCKET_DIR=/home/z/mysql-run

mkdir -p $SOCKET_DIR

# Check if MySQL is already running
if [ -S "$SOCKET_DIR/mysqld.sock" ]; then
  if $MYSQL_HOME/bin/mysql -S $SOCKET_DIR/mysqld.sock -u root -e "SELECT 1" >/dev/null 2>&1; then
    echo "[MySQL] Already running, skipping start"
  else
    rm -f $SOCKET_DIR/mysqld.sock $SOCKET_DIR/mysqld.pid
    echo "[MySQL] Stale socket found, cleaning up"
  fi
fi

# Start MySQL if not running
if ! $MYSQL_HOME/bin/mysql -S $SOCKET_DIR/mysqld.sock -u root -e "SELECT 1" >/dev/null 2>&1; then
  # Clean stale pid
  if [ -f "$SOCKET_DIR/mysqld.pid" ]; then
    kill $(cat $SOCKET_DIR/mysqld.pid) 2>/dev/null
    rm -f $SOCKET_DIR/mysqld.pid
    sleep 1
  fi

  echo "[MySQL] Starting MariaDB server..."
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

  # Wait for MySQL to be ready
  for i in $(seq 1 30); do
    if [ -S "$SOCKET_DIR/mysqld.sock" ]; then
      if $MYSQL_HOME/bin/mysql -S $SOCKET_DIR/mysqld.sock -u root -e "SELECT 1" >/dev/null 2>&1; then
        echo "[MySQL] Ready!"
        # Ensure database exists
        $MYSQL_HOME/bin/mysql -S $SOCKET_DIR/mysqld.sock -u root -e "
          CREATE DATABASE IF NOT EXISTS fundgrow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        " 2>/dev/null
        break
      fi
    fi
    sleep 0.5
  done
fi

# Export DATABASE_URL for Prisma
export DATABASE_URL="mysql://root:@127.0.0.1:3306/fundgrow"

echo "[Next.js] Starting development server..."
exec next dev -p 3000 2>&1 | tee dev.log
