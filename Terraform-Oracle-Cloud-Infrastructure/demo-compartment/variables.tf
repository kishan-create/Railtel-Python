variable "tenancy_ocid" {}
variable "user_ocid" {}
variable "fingerprint" {}
variable "private_key_path" {
  default = "/home/automate/.keys/ocipriv.pem"
}
variable "private_key_password" {
  default = ""
}
variable "compartment_ocid" {}
variable "region" {}

variable "availability_domains_number" {
  default = 1
}
