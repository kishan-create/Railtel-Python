resource "oci_identity_policy" "enable-marketplace" {
  name           = "enable-marketplace"
  description    = "policy created for WLS & SOA marketplace usage "
  compartment_id = var.compartment_ocid

  statements = ["Allow dynamic-group ${data.oci_identity_dynamic_groups.mkt-dyn-group.dynamic_groups.0.name} to use keys in compartment ${data.oci_identity_compartments.compartments1.compartments.0.name}",
  ]
}

resource "oci_identity_policy" "enable-psm" {
  name           = "enable-psm"
  description    = "policy created for PSM usage "
  compartment_id = var.compartment_ocid

  statements = ["Allow service PSM to inspect vcns in compartment ${data.oci_identity_compartments.compartments1.compartments.0.name}",
  "Allow service PSM to use subnets in compartment ${data.oci_identity_compartments.compartments1.compartments.0.name}",
  "Allow service PSM to use vnics in compartment ${data.oci_identity_compartments.compartments1.compartments.0.name}",
  "Allow service PSM to manage security-lists in compartment ${data.oci_identity_compartments.compartments1.compartments.0.name}", 
  "Allow service PSM to manage all-resources in compartment ManagedCompartmentForPaaS",
  "Allow service OracleEnterpriseManager to manage all-resources in compartment ManagedCompartmentForPaaS",
  "Allow service PSM to manage users in tenancy where target.user.name = /__PSM*/",
  "Allow any-user to manage all-resources in compartment ManagedCompartmentForPaaS where request.user.name = /__PSM*/",
  "Allow any-user to manage all-resources in compartment ManagedCompartmentForPaaS where request.instance.compartment.id = '${data.oci_identity_compartments.psm-compartments.compartments.0.id}'",
  "Allow service PSM to inspect tenant in tenancy",
  "Allow service PSM to inspect compartments in tenancy",
  "Allow service OKE to manage all-resources in tenancy",
  "Allow service PSM to inspect database-family in tenancy",
  ]
}

resource "oci_identity_policy" "enable-osms" {
  compartment_id = var.compartment_ocid
  name           = "enable-osms"
  description    = "Policy used to trigger osms service tenant backend build"

  statements = [
    "ALLOW dynamic-group ${oci_identity_dynamic_group.enable-osms.name} to use osms-managed-instances in tenancy ", //grant access to the OS Management service
    "ALLOW dynamic-group ${oci_identity_dynamic_group.enable-osms.name} to read instance-family in tenancy ",       //grant permission to retrieve instance's details for authorization purposes
    "ALLOW service osms to read instances in tenancy"                                                               //permit instances to emit metrics
  ]

  freeform_tags = {
    "TF-Module"   = "no"
    "Terraformed" = "yes"
  }
  version_date = null
}

resource "oci_identity_policy" "admin-app" {
  name           = "admin-app"
  description    = "policy created for application administrators "
  compartment_id = var.compartment_ocid

  statements = ["Allow group ${data.oci_identity_groups.groups1.groups.0.name} to manage volume-family in tenancy",
  "Allow group ${data.oci_identity_groups.groups1.groups.0.name} to use instance-family in tenancy",
  "Allow group ${data.oci_identity_groups.groups1.groups.0.name} to use cloud-shell in tenancy",
  "Allow group ${data.oci_identity_groups.groups1.groups.0.name} to inspect tag-namespaces in tenancy",
  "Allow group ${data.oci_identity_groups.groups1.groups.0.name} to use tag-namespaces in tenancy",
  "Allow group ${data.oci_identity_groups.groups1.groups.0.name} to manage database-family in compartment  ${data.oci_identity_compartments.compartments1.compartments.0.name}",
  "Allow group ${data.oci_identity_groups.groups1.groups.0.name} to manage all-resources in compartment  ${data.oci_identity_compartments.compartments1.compartments.0.name}",
  ]
}





