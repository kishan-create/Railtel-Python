const { exec } = require("child_process");
const path = require("path");

// Define the path to your Terraform project directory
// const terraformPath = path.join(__dirname, "terraform");
const terraformPath = path.join(process.cwd(), "terraform");

// Endpoint to trigger Terraform apply
exports.ApplyTerraform = (req, res) => {
  console.log(terraformPath, __dirname, process.cwd());

  // Initialize Terraform
  exec(`terraform init`, { cwd: terraformPath }, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error initializing Terraform:(req, err, stdout, stderr))`, req, err, stdout, stderr);
      return res.status(500).send(`Error initializing Terraform: ${stderr}`);
    }

    // Plan and apply Terraform
    exec(
      `terraform apply -auto-approve`,
      { cwd: terraformPath },
      (err, stdout, stderr) => {
        if (err) {
          console.error(`Error applying Terraform: ${stderr}`);
          return res.status(500).send(`Error applying Terraform: ${stderr}`);
        }

        console.log(`Terraform applied successfully: ${stdout}`);
        res.send(`Terraform applied successfully: ${stdout}`);
      }
    );
  });
};
