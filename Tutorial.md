
<table>
  <tr>
    <td><img src="Imgs\Icon_AI_detection.png" alt="Project Icon" width="100"></td>
    <td><h1># Welcome to the Tutorial!</h1></td>
  </tr>
</table>
## Getting Set Up

### Google Drive Setup
1. **Google Folder**: Start by creating a dedicated folder in your Google Drive to organize your project materials.
2. **Google Docs and Apps Script**: Create a test Google Doc and an Apps Script file. I recommend using my `Doc_test` to test the scripts and place it in the Google Doc.

### Apps Script Development
- In the Apps Script, create `.gs` files and copy my code into them.
- The code is organized with a `test.gs` for running functions alongside HTML, as well as a `processing.gs` and `parsing.gs` for better readability.
- You will also find in the folder, `code appscripts`, a simple HTML page that allows communication with `.gs` files and facilitates simple dashboards on the results.

## Setting Up Docker

1. **Create Docker Container**:
   - Navigate to the `my docker` folder, build your Docker container, and upload it to the Docker website. Create a Docker account if you don't already have one.

## Google Compute Engine Setup

1. **Account and Funding**:
   - Ensure you have a Google Compute Engine account set up and slightly funded. Managing requests carefully and shutting down instances when not in use should keep costs to a minimum.

2. **Create Compute Engine Instance**:
   - Use the following `gcloud` command to set up a 15 GB machine: (don't forget to change to your project and your account, if your not sure how to fill it first create a random machine and copy the equivalent code ;)

```bash
gcloud compute instances create pii \
    --project= your_project \
    --zone=europe-west9-a \
    --machine-type=e2-medium \
    --network-interface=network-tier=PREMIUM,stack-type=IPV4_ONLY,subnet=default \
    --maintenance-policy=MIGRATE \
    --provisioning-model=STANDARD \
    --service-account=your_account \
    --scopes=https://www.googleapis.com/auth/devstorage.read_only,https://www.googleapis.com/auth/logging.write,https://www.googleapis.com/auth/monitoring.write,https://www.googleapis.com/auth/servicecontrol,https://www.googleapis.com/auth/service.management.readonly,https://www.googleapis.com/auth/trace.append \
    --tags=http-server,https-server \
    --create-disk=auto-delete=yes,boot=yes,device-name=pii,image=projects/debian-cloud/global/images/debian-12-bookworm-v20240213,mode=rw,size=20,type= your project \
    --no-shielded-secure-boot \
    --shielded-vtpm \
    --shielded-integrity-monitoring \
    --labels=goog-ec-src=vm_add-gcloud \
    --reservation-affinity=any
```


3. **SSH into Your Instance and Set Up Docker**:

## SSH into Your Instance and Set Up Docker

Once your instance is created, you can SSH into it and set up Docker:

```bash
# SSH into your Google Compute Engine instance
gcloud compute ssh pii

# Once logged in, run updates and install necessary packages
sudo apt-get update
sudo apt-get install nano

# Login as super user
sudo -s

# Install Docker
sudo apt-get install docker.io

# Log into Docker with your Docker Hub credentials
sudo docker login -u yourusername
# Enter your password when prompted

# Pull your Docker container
sudo docker pull yourusername/yourcontainer

# Run your Docker container
sudo docker run -d -p 80:5000 yourusername/yourcontainer
```

Now, your Docker container should be running on the Google Compute Engine instance, ready to serve the PII detection application.

Remember to replace `yourusername` and `yourcontainer` with your actual Docker username and the name of your container.