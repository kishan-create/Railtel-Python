resource "oci_identity_compartment" "demo-compartment" {
  name           = "demo-compartment"
  description    = "compartment created by terraform for demo purpose"
  compartment_id = var.tenancy_ocid
  enable_delete  = false                              // true will cause this compartment to be deleted when running `terrafrom destroy`
  //defined_tags = {}
}

data "oci_identity_compartments" "compartments1" {
  compartment_id = "${oci_identity_compartment.demo-compartment.compartment_id}"

  filter {
    name   = "name"
    values = ["demo-compartment"]
  }
}

output "compartments" {
  value = "${data.oci_identity_compartments.compartments1.compartments}"
}


data "oci_identity_compartments" "psm-compartments" {
  compartment_id = var.tenancy_ocid

  filter {
    name   = "name"
    values = ["ManagedCompartmentForPaaS"]
  }
}

output "psm-compartments" {
  value = "${data.oci_identity_compartments.psm-compartments.compartments}"
}