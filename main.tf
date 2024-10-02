provider "aws" {
  region = "us-east-1"
}

resource "aws_cognito_user_pool" "default-pool" {
  name = "default-pool"

  auto_verified_attributes = ["email"]

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
  }

  admin_create_user_config {
    allow_admin_create_user_only = true
  }
}

resource "aws_cognito_user_pool_client" "user_pool_client" {
  name         = "user_pool_client"
  user_pool_id = aws_cognito_user_pool.default-pool.id

  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
  ]

  prevent_user_existence_errors = "ENABLED"
}

resource "aws_cognito_user" "test_user" {
  user_pool_id = aws_cognito_user_pool.default-pool.id
  username = "test_user"
  password = "root1234567"

  attributes = {
    email          = "teste@gmail.com"
  }
}

output "user_pool_id" {
  value = aws_cognito_user_pool.default-pool.id
}

output "test_user" {
  value = aws_cognito_user.test_user.username
}


resource "local_file" "env_file" {
  filename = "${path.module}/src/.env"
  content  = <<-EOT
    USER_POOL_ID=${aws_cognito_user_pool.default-pool.id}
    USERNAME=${aws_cognito_user.test_user.username}
    PASSWORD=${aws_cognito_user.test_user.password}
    CLIENTID=${aws_cognito_user_pool_client.user_pool_client.id}
  EOT
}


resource "aws_lambda_layer_version" "dep_layer" {
  layer_name = "dependencies"
  filename   = "./src/auth/dist/index.zip"  # Path to the zip file containing your layer
  compatible_runtimes = ["nodejs18.x"]    # Adjust based on your runtime
}

resource "aws_lambda_function" "lambda_function" {
  function_name = "lambda-auth"
  role          = "arn:aws:iam::808038813283:role/LabRole"
  handler       = "./src/auth/dist/app.lambdaHandler"
  runtime       = "nodejs18.x"

  filename         = "${path.module}/src/auth/dist/index.zip"
  source_code_hash = filebase64sha256("${path.module}/src/auth/dist/index.zip")

  layers = [aws_lambda_layer_version.dep_layer.arn]
}
