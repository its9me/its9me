export interface SearchQuery {
  id: string;
  name: string;
  query: string;
  engine: 'Shodan' | 'FOFA' | 'Censys';
  isCustom?: boolean;
  category?: string;
  description?: string;
}

export const defaultSearchQueries: SearchQuery[] = [
  // Shodan Default Queries
  { id: '1', name: 'Open MongoDB', query: 'port:27017 -"authentication error" hostname:"{target}"', engine: 'Shodan', category: 'Databases', description: 'Finds MongoDB databases potentially accessible without authentication.' },
  { id: '2', name: 'Open Elasticsearch', query: 'port:9200 "cluster_name" hostname:"{target}"', engine: 'Shodan', category: 'Databases', description: 'Finds Elasticsearch instances.' },
  { id: '3', name: 'Exposed Redis', query: 'port:6379 "redis_version" hostname:"{target}"', engine: 'Shodan', category: 'Databases', description: 'Finds Redis instances.' },
  { id: '4', name: 'Exposed Memcached', query: 'port:11211 "STAT version" hostname:"{target}"', engine: 'Shodan', category: 'Databases', description: 'Finds Memcached instances.' },
  { id: '5', name: 'Exposed SQL Server', query: 'port:1433 "ServerName" hostname:"{target}"', engine: 'Shodan', category: 'Databases', description: 'Finds MS SQL servers.' },
  { id: '6', name: 'Anonymous FTP', query: 'port:21 "230 login successful" hostname:"{target}"', engine: 'Shodan', category: 'File Sharing', description: 'Finds FTP servers allowing anonymous login.' },
  { id: '7', name: 'Exposed SMB', query: 'port:445 "Authentication: disabled" hostname:"{target}"', engine: 'Shodan', category: 'File Sharing', description: 'Finds exposed SMB services.' },
  { id: '8', name: 'RDP with Screenshots', query: 'port:3389 has_screenshot:true hostname:"{target}"', engine: 'Shodan', category: 'Remote Access', description: 'Finds Open RDP servers.' },
  { id: '9', name: 'VNC No Authentication', query: 'port:5900 "authentication disabled" hostname:"{target}"', engine: 'Shodan', category: 'Remote Access', description: 'Finds exposed VNC servers.' },
  { id: '10', name: 'Jenkins Dashboard', query: 'port:8080 "X-Jenkins" hostname:"{target}"', engine: 'Shodan', category: 'CI/CD', description: 'Finds Jenkins CI instances.' },
  { id: '11', name: 'GitLab', query: 'http.title:"GitLab" hostname:"{target}"', engine: 'Shodan', category: 'CI/CD', description: 'Finds GitLab instances.' },
  { id: '12', name: 'Grafana Dashboard', query: 'http.title:"Grafana" hostname:"{target}"', engine: 'Shodan', category: 'Monitoring', description: 'Finds Grafana instances.' },
  { id: '13', name: 'Kibana Dashboard', query: 'port:5601 "kbn-name: kibana" hostname:"{target}"', engine: 'Shodan', category: 'Monitoring', description: 'Finds Kibana instances.' },
  { id: '14', name: 'Webcams', query: '"Server: SQ-WEBCAM" hostname:"{target}"', engine: 'Shodan', category: 'IoT & Webcams', description: 'Finds exposed webcams.' },
  { id: '15', name: 'IP Cameras', query: '"Camera" port:80 hostname:"{target}"', engine: 'Shodan', category: 'IoT & Webcams', description: 'Finds exposed IP Cameras.' },
  { id: '16', name: 'ICS / SCADA', query: 'port:502 "Modbus" hostname:"{target}"', engine: 'Shodan', category: 'ICS / SCADA', description: 'Finds Modbus systems.' },
  { id: '17', name: 'Siemens S7', query: 'port:102 hostname:"{target}"', engine: 'Shodan', category: 'ICS / SCADA', description: 'Finds Siemens S7 PLCs.' },

  // FOFA Default Queries
  { id: '18', name: 'Spring Boot Actuator', query: 'domain="{target}" && (app="SPINGBOOT-ACTUATOR" || title="Spring Boot")', engine: 'FOFA', category: 'Web Servers', description: 'Finds Spring Boot applications.' },
  { id: '19', name: 'Apache Tomcat', query: 'domain="{target}" && app="Apache-Tomcat"', engine: 'FOFA', category: 'Web Servers', description: 'Finds Apache Tomcat servers.' },
  { id: '20', name: 'WordPress', query: 'domain="{target}" && app="WordPress"', engine: 'FOFA', category: 'CMS', description: 'Finds WordPress installations.' },
  { id: '21', name: 'Joomla', query: 'domain="{target}" && app="Joomla"', engine: 'FOFA', category: 'CMS', description: 'Finds Joomla installations.' },
  { id: '22', name: 'Nginx Directory Listing', query: 'domain="{target}" && title="Index of /" && server="nginx"', engine: 'FOFA', category: 'Directory Listing', description: 'Finds exposed Nginx directories.' },
  { id: '23', name: 'Apache Directory Listing', query: 'domain="{target}" && title="Index of /" && server="Apache"', engine: 'FOFA', category: 'Directory Listing', description: 'Finds exposed Apache directories.' },
  { id: '24', name: 'Exposed .git', query: 'domain="{target}" && (body="/.git/" || header="/.git/")', engine: 'FOFA', category: 'Source Code Leaks', description: 'Finds exposed .git folders.' },
  { id: '25', name: 'Exposed .env', query: 'domain="{target}" && (body="DB_PASSWORD=" || body="MYSQL_ROOT_PASSWORD=")', engine: 'FOFA', category: 'Source Code Leaks', description: 'Finds exposed .env files.' },
  { id: '26', name: 'SQL Injection Error', query: 'domain="{target}" && body="You have an error in your SQL syntax"', engine: 'FOFA', category: 'Vulnerabilities', description: 'Finds sites returning SQL injection errors.' },
  { id: '27', name: 'PhpMyAdmin', query: 'domain="{target}" && app="phpMyAdmin"', engine: 'FOFA', category: 'Databases', description: 'Finds exposed PhpMyAdmin panels.' },

  // Censys Default Queries
  { id: '28', name: 'Exposed AWS Keys', query: 'host.services.http.response.body:"AKIA" and host.services.cert.names:"{target}"', engine: 'Censys', category: 'Source Code Leaks', description: 'Finds exposed AWS Access Keys.' },
  { id: '29', name: 'Open Docker API', query: 'host.services.port:"2375" and (host.services.software.vendor:"Docker" or host.services.hardware.vendor:"Docker" or host.services.operating_systems.vendor:"Docker") and host.services.cert.names:"{target}"', engine: 'Censys', category: 'DevOps', description: 'Finds exposed Docker APIs.' },
  
  // Extra Shodan
  { id: '30', name: 'Exposed Kubernetes', query: 'port:6443 "kubernetes" hostname:"{target}"', engine: 'Shodan', category: 'DevOps', description: 'Finds exposed Kubernetes API servers.' },
  { id: '31', name: 'Exposed Docker API', query: 'port:2375 "Docker" hostname:"{target}"', engine: 'Shodan', category: 'DevOps', description: 'Finds exposed Docker daemon APIs.' },
  { id: '32', name: 'Exposed RabbitMQ', query: 'port:15672 "RabbitMQ Management" hostname:"{target}"', engine: 'Shodan', category: 'Message Brokers', description: 'Finds exposed RabbitMQ management panels.' },
  { id: '33', name: 'Exposed Kafka', query: 'port:9092 "Kafka" hostname:"{target}"', engine: 'Shodan', category: 'Message Brokers', description: 'Finds exposed Kafka message brokers.' },
  { id: '34', name: 'Exposed MySQL', query: 'port:3306 "MySQL" hostname:"{target}"', engine: 'Shodan', category: 'Databases', description: 'Finds exposed MySQL databases.' },
  { id: '35', name: 'Exposed PostgreSQL', query: 'port:5432 "PostgreSQL" hostname:"{target}"', engine: 'Shodan', category: 'Databases', description: 'Finds exposed PostgreSQL databases.' },
  { id: '36', name: 'Exposed SSH', query: 'port:22 "SSH" hostname:"{target}"', engine: 'Shodan', category: 'Remote Access', description: 'Finds exposed SSH services.' },
  { id: '37', name: 'Exposed Telnet', query: 'port:23 hostname:"{target}"', engine: 'Shodan', category: 'Remote Access', description: 'Finds exposed Telnet services.' },
  { id: '38', name: 'Default Tomcat Manager', query: 'http.title:"Tomcat Web Application Manager" hostname:"{target}"', engine: 'Shodan', category: 'Web Servers', description: 'Finds exposed Tomcat Manager panels.' },
  { id: '39', name: 'Exposed WebLogic', query: 'port:7001 "WebLogic" hostname:"{target}"', engine: 'Shodan', category: 'Web Servers', description: 'Finds exposed WebLogic servers.' },
  { id: '40', name: 'Exposed JBoss', query: 'port:8080 "JBoss" hostname:"{target}"', engine: 'Shodan', category: 'Web Servers', description: 'Finds exposed JBoss servers.' },
  { id: '41', name: 'Exposed Exchange / OWA', query: '"Outlook Web Access" hostname:"{target}"', engine: 'Shodan', category: 'Email', description: 'Finds Microsoft Exchange / OWA logins.' },

  // Extra FOFA
  { id: '42', name: 'Swagger UI', query: 'domain="{target}" && (title="Swagger UI" || body="swagger-ui")', engine: 'FOFA', category: 'API Docs', description: 'Finds exposed Swagger UI documentation.' },
  { id: '43', name: 'SonarQube', query: 'domain="{target}" && app="SonarQube"', engine: 'FOFA', category: 'CI/CD', description: 'Finds exposed SonarQube instances.' },
  { id: '44', name: 'RabbitMQ', query: 'domain="{target}" && app="RabbitMQ"', engine: 'FOFA', category: 'Message Brokers', description: 'Finds exposed RabbitMQ panels.' },
  { id: '45', name: 'Grafana', query: 'domain="{target}" && app="Grafana"', engine: 'FOFA', category: 'Monitoring', description: 'Finds exposed Grafana panels.' },
  { id: '46', name: 'Kibana', query: 'domain="{target}" && app="Elastic-Kibana"', engine: 'FOFA', category: 'Monitoring', description: 'Finds exposed Kibana panels.' },
  { id: '47', name: 'Jenkins', query: 'domain="{target}" && app="Jenkins"', engine: 'FOFA', category: 'CI/CD', description: 'Finds exposed Jenkins panels.' },
  { id: '48', name: 'GitLab', query: 'domain="{target}" && app="GitLab"', engine: 'FOFA', category: 'CI/CD', description: 'Finds exposed GitLab instances.' },
  { id: '49', name: 'MinIO', query: 'domain="{target}" && app="MinIO"', engine: 'FOFA', category: 'Cloud Storage', description: 'Finds exposed MinIO storage servers.' },
  { id: '50', name: 'Vue/React Dev Mode', query: 'domain="{target}" && (title="Webpack App" || title="React App" || title="Vue App")', engine: 'FOFA', category: 'Web Servers', description: 'Finds frontend dev servers.' },
  { id: '51', name: 'PHPInfo', query: 'domain="{target}" && title="phpinfo()"', engine: 'FOFA', category: 'Info Leak', description: 'Finds exposed phpinfo() pages.' },
  { id: '52', name: 'Config Leak', query: 'domain="{target}" && (body="DB_USER=" || body="aws_access_key_id")', engine: 'FOFA', category: 'Source Code Leaks', description: 'Finds leaked config files.' },
  { id: '53', name: 'VPN Portals', query: 'domain="{target}" && (app="PulseSecure-SSL-VPN" || app="Fortinet-FortiGate" || app="PaloAlto-GlobalProtect")', engine: 'FOFA', category: 'Remote Access', description: 'Finds VPN entry points.' },

  // Extra Censys
  { id: '54', name: 'MySQL Databases', query: 'host.services.port:3306 and host.services.cert.names:"{target}"', engine: 'Censys', category: 'Databases', description: 'Finds exposed MySQL databases.' },
  { id: '55', name: 'PostgreSQL Databases', query: 'host.services.port:5432 and host.services.cert.names:"{target}"', engine: 'Censys', category: 'Databases', description: 'Finds exposed PostgreSQL databases.' },
  { id: '56', name: 'MongoDB Databases', query: 'host.services.port:27017 and host.services.cert.names:"{target}"', engine: 'Censys', category: 'Databases', description: 'Finds exposed MongoDB databases.' },
  { id: '57', name: 'Elasticsearch', query: 'host.services.port:9200 and host.services.cert.names:"{target}"', engine: 'Censys', category: 'Databases', description: 'Finds exposed Elasticsearch databases.' },
  { id: '58', name: 'Redis', query: 'host.services.port:6379 and host.services.cert.names:"{target}"', engine: 'Censys', category: 'Databases', description: 'Finds exposed Redis instances.' },
  { id: '59', name: 'SSH Services', query: 'host.services.port:22 and host.services.cert.names:"{target}"', engine: 'Censys', category: 'Remote Access', description: 'Finds SSH services running on domains holding the cert.' },
  { id: '60', name: 'Exposed SMTP', query: 'host.services.port:25 and host.services.cert.names:"{target}"', engine: 'Censys', category: 'Email', description: 'Finds exposed SMTP services.' },
  { id: '61', name: 'Exposed RDP', query: 'host.services.port:3389 and host.services.cert.names:"{target}"', engine: 'Censys', category: 'Remote Access', description: 'Finds Remote Desktop Protocol services.' },
  { id: '62', name: 'Jenkins', query: 'host.services.http.response.html_title:"Dashboard [Jenkins]" and host.services.cert.names:"{target}"', engine: 'Censys', category: 'CI/CD', description: 'Finds Jenkins CI servers.' },
  { id: '63', name: 'Grafana', query: 'host.services.http.response.html_title:"Grafana" and host.services.cert.names:"{target}"', engine: 'Censys', category: 'Monitoring', description: 'Finds Grafana monitoring servers.' },
  { id: '64', name: 'Jira Software', query: 'host.services.http.response.html_title:"Jira" and host.services.cert.names:"{target}"', engine: 'Censys', category: 'Tracking', description: 'Finds Atlassian Jira instances.' },
  { id: '65', name: 'Exposed FTP', query: 'host.services.port:21 and host.services.cert.names:"{target}"', engine: 'Censys', category: 'File Sharing', description: 'Finds exposed FTP services.' },
];
