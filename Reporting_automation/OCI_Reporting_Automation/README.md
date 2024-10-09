# OCI Report Automation Script - Linux
This script is used automate the processing of creating of environment reports. This script uses a combination of OCI-CLI API and Python to achieve this.

### Prerequisites

python
python-pandas
python-pip
python-xlsxwriter
oci-cli

### Installing

Step 1: Update the system

sudo yum update
sudo shutdown -r now

Step 2: Install Python and dependencies

sudo easy_install install python-pip
sudo easy_install pip
sudo pip install pandas
sudo pip install openpyxl

Step 3: Install OCI-CLI

bash -c "$(curl -L https://raw.githubusercontent.com/oracle/oci-cli/master/scripts/install/install.sh)"


Step 4: Configure OCI-CLI


oci setup config
oci setup repair-file-permissions --file <your pem file locaiton>


Step 5: Running


Transfer python file "main.py" to desired folder location and run python script.

python main.py

## Built With

* [OCI CLI](https://github.com/oracle/oci-cli)
* [Pandas](https://pandas.pydata.org/)
* [Openpyxl](https://openpyxl.readthedocs.io/en/stable/)

