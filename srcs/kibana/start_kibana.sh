   #!/bin/bash

   set -e

   # Run the fetch script
   python3 /bin/fetch_kibana_data.py

   # Start Kibana
   exec /usr/share/kibana/bin/kibana