module.exports = {
    apps: [{
      name: "discord-bot",
      script: "node_modules/tsx/dist/cli.mjs",
      args: "src/index.ts",
      watch: false,
      exec_mode: "fork",
      max_memory_restart: "512M",
      exp_backoff_restart_delay: 100,
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 3000,
      error_file: "logs/err.log",
      out_file: "logs/out.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      env: {
        NODE_ENV: "production"
      },
      min_uptime: "5000",
      kill_timeout: 3000,
      wait_ready: true,
      listen_timeout: 5000,
      trace: true,
      node_args: "--trace-warnings"
    }]
  } 