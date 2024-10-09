
variable "lb_name" {
  default = "lbr_test_terraform"
}
variable "backend_set_name" {
  default = "lbr_test_terraform"
}

variable "lbr_listener_name" {
  default = "lbr_test_terraform"
}

variable "priv_ip_info" {
  type = map

  default = {
    node1 = {
      ip_details      = "10.1.1.6"
    }
    node2 = {
      ip_details      = "10.1.1.9"
    }
  }
}

variable "subnet_id" {
  default = "ocid1.subnet.oc1.iad.aaaaaaaaho2l74cviau2rhrnr3rm4dgibxf6gnwlu4jjqsqtbknjhbf6zzeq"
}
variable "compartment_ocid" {
  default = "ocid1.compartment.oc1..aaaaaaaayhthdq3zsrckwpnxkkpxn566keys7oezpaec5itwpoyk2mukdg2a"
}
