variable "client_prefix" {
  default = "clt"
}
variable "subnet_prefix" {
  default = "sub"
}

variable "vcn_cidr" {
  default = "10.0.0.0/16"
}

variable "vcn_sub_cidr" {
  default = "10.0.0.0/24"
}

variable "mgmt_cidr" {
  default = "10.1.0.0/23"
}
