/*
# LICENSE UPL 1.0
#
# Copyright (c) 1982-2018 Oracle and/or its affiliates. All rights reserved.
# 
# Since: July, 2019
# Author: Oracle Consulting France
# Description: Assign value to Terraform variables.
# Any variable for which you define a value needs to exist in the terraform configuration (ideally declared inside *variables.tf)
#
# DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS HEADER.
*/

/*----------------------------------------------------------------------------
 HOW TO USE THIS FILE

 1. Edit variables values below to fit your environment
 2. rename this file to "terraform.tfvars" (remove the .SAMPLE extension)
 3. keep this file in the same folder as your terraform *.tf files
 4. If you keep terraform configuration into Git, remember to add the renamed file to your .gitignore
 5. Keep your RSA private key outside of your terraform work folder
----------------------------------------------------------------------------*/

# Oracle Cloud Infrastructure (OCI) connection information

/* REFERENCE BLOCK
Tenant name : tenant name
User name	: username@domain.com
Compartment : compartment
*/ 
tenancy_ocid     = "ocid1.tenancy.oc1..aaaaaaaawz5w437y7pvvqmdel45hyr62ku7zg4rdmogrzybsklgcwe5wxuaa"
user_ocid        = "ocid1.user.oc1..aaaaaaaabkhusemfg7nhntopm5535m7da2j3m4h6e75353mjggs23sh4eiza"
fingerprint      = "cb:1b:13:38:15:20:ab:57:e3:1e:42:ac:26:1b:38:32"
private_key_path = "/home/automate/.keys/ocipriv.pem"
compartment_ocid = "ocid1.tenancy.oc1..aaaaaaaawz5w437y7pvvqmdel45hyr62ku7zg4rdmogrzybsklgcwe5wxuaa"
region           = "us-ashburn-1"

