# main.tf

provider "local" {}

resource "local_file" "hello_world" {
  filename = "hello_world.txt"
  content  = "Hello, World! This is Terraform.fffff"
}
