#!/usr/bin/env bash
# Launch script for NovaMart Spring Boot Backend

export JAVA_HOME=/opt/homebrew/opt/openjdk/libexec/openjdk.jdk/Contents/Home
export PATH=$JAVA_HOME/bin:/opt/homebrew/opt/maven/bin:$PATH

echo "=========================================================="
echo "  Starting NovaMart Spring Boot Backend on :8080"
echo "=========================================================="

cd backend

# If user explicitly requests 'h2' or 'dev', run built-in database
if [ "$1" = "h2" ] || [ "$1" = "dev" ] || [ "$1" = "--h2" ] || [ "$1" = "--dev" ]; then
    echo "⚡ Running with built-in database (H2 in MySQL mode)..."
    mvn spring-boot:run -o
    exit 0
fi

# Function to check if MySQL port 3306 is open
is_mysql_running() {
    (echo > /dev/tcp/127.0.0.1/3306) 2>/dev/null || nc -z 127.0.0.1 3306 2>/dev/null
}

if is_mysql_running; then
    echo "✅ MySQL server detected on port 3306!"
    if [ -n "$MYSQL_PASSWORD" ]; then
        echo "🔑 Using MySQL password from environment..."
    else
        echo "ℹ️  Using default password (empty). If your MySQL root has a password, pass it via: MYSQL_PASSWORD=your_password ./start-backend.sh"
    fi
    echo "Connecting to MySQL (ecommerce_db)..."
    mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=mysql" -o
else
    echo "ℹ️  MySQL not detected on port 3306. Using built-in database (MySQL mode)."
    mvn spring-boot:run -o
fi
