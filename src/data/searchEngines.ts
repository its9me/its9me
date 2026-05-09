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
  { id: '28', name: 'Exposed AWS Keys', query: 'services.http.response.body: "AKIA" and services.tls.certificates.leaf_data.names: "{target}"', engine: 'Censys', category: 'Source Code Leaks', description: 'Finds exposed AWS Access Keys.' },
  { id: '29', name: 'Open Docker API', query: 'services.port: 2375 and services.software.vendor: "Docker" and services.tls.certificates.leaf_data.names: "{target}"', engine: 'Censys', category: 'DevOps', description: 'Finds exposed Docker APIs.' }
];
