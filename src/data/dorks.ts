export interface Dork {
  id: string;
  name: string;
  query: string;
  isCustom?: boolean;
  category?: string;
  description?: string;
}

export const defaultDorks: Dork[] = [
  { id: '1', name: 'PHP EXTENSION W/ PARAMETERS', query: 'site:{target} ext:php inurl:?', description: 'Finds PHP files that accept parameters (often targets for SQLi, XSS, LFI).' },
  { id: '2', name: 'API ENDPOINTS', query: 'site:{target} inurl:api | site:*/rest | site:*/v1 | site:*/v2 | site:*/v3 | inurl:graphql', description: 'Discovers API boundaries and RESTful structures.' },
  { id: '3', name: 'JUICY EXTENSIONS', query: 'site:"{target}" ext:log | ext:txt | ext:conf | ext:cnf | ext:ini | ext:env | ext:sh | ext:bak | ext:backup | ext:swp | ext:old | ext:~ | ext:git | ext:svn | ext:htpasswd | ext:htaccess | ext:json', description: 'Searches for configuration files, backups, logs, and potential credentials.' },
  { id: '4', name: 'HIGH % INURL KEYWORDS', query: 'inurl:conf | inurl:env | inurl:cgi | inurl:bin | inurl:etc | inurl:root | inurl:sql | inurl:backup | inurl:admin | inurl:php site:{target}', description: 'Targets administrative directories and sensitive path names.' },
  { id: '5', name: 'SERVER ERRORS', query: 'inurl:"error" | intitle:"exception" | intitle:"failure" | intitle:"server at" | inurl:exception | "database error" | "SQL syntax" | "undefined index" | "unhandled exception" | "stack trace" site:{target}', description: 'Finds verbose server errors that might leak stack traces or software versions.' },
  { id: '6', name: 'XSS PRONE PARAMETERS', query: 'inurl:q= | inurl:s= | inurl:search= | inurl:query= | inurl:keyword= | inurl:lang= inurl:& site:{target}', description: 'Common parameters used for searching and filtering, historically prone to Reflected XSS.' },
  { id: '7', name: 'OPEN REDIRECT PRONE PARAMETERS', query: 'inurl:url= | inurl:return= | inurl:next= | inurl:redirect= | inurl:redir= | inurl:ret= | inurl:r2= | inurl:page= inurl:& inurl:http site:{target}', description: 'Endpoints that handle redirection, often vulnerable to Open Redirects.' },
  { id: '8', name: 'SQLI PRONE PARAMETERS', query: 'inurl:id= | inurl:pid= | inurl:category= | inurl:cat= | inurl:action= | inurl:sid= | inurl:dir= inurl:& site:{target}', description: 'Common numerical or ID-based parameters that might be injected if unsanitized.' },
  { id: '9', name: 'SSRF PRONE PARAMETERS', query: 'inurl:http | inurl:url= | inurl:path= | inurl:dest= | inurl:html= | inurl:data= | inurl:domain= | inurl:page= inurl:& site:{target}', description: 'Parameters that take URLs, potential sinks for Server-Side Request Forgery.' },
  { id: '10', name: 'LFI PRONE PARAMETERS', query: 'inurl:include | inurl:dir | inurl:detail= | inurl:file= | inurl:folder= | inurl:inc= | inurl:locate= | inurl:doc= | inurl:conf= inurl:& site:{target}', description: 'Parameters loading local resources, potential Local File Inclusion sinks.' },
  { id: '11', name: 'RCE PRONE PARAMETERS', query: 'inurl:cmd | inurl:exec= | inurl:query= | inurl:code= | inurl:do= | inurl:run= | inurl:read= | inurl:ping= inurl:& site:{target}', description: 'Parameters executing commands, highly suspicious.' },
  { id: '12', name: 'FILE UPLOAD ENDPOINTS', query: 'site:{target} intext:”choose file” | intext:"select file" | intext:"upload PDF" | intext:"browse" inurl:upload', description: 'Pages containing file upload forms.' },
  { id: '13', name: 'API DOCS', query: 'inurl:apidocs | inurl:api-docs | inurl:swagger | inurl:api-explorer | inurl:redoc | inurl:openapi | intitle:"Swagger UI" site:"{target}"', description: 'Publicly exposed API documentation (Swagger, Redoc).' },
  { id: '14', name: 'LOGIN & AUTH PAGES', query: 'inurl:login | inurl:signin | intitle:login | intitle:signin | inurl:secure | inurl:auth | inurl:sso | inurl:oauth site:{target}', description: 'Authentication boundaries, SSO portals, and login panels.' },
  { id: '15', name: 'TEST/DEV ENVIRONMENTS', query: 'inurl:test | inurl:env | inurl:dev | inurl:staging | inurl:sandbox | inurl:debug | inurl:temp | inurl:internal | inurl:demo site:{target}', description: 'Subdomains or folders meant for internal testing (often contain older, vulnerable code).' },
  { id: '16', name: 'SENSITIVE DOCUMENTS', query: 'site:{target} ext:txt | ext:pdf | ext:xml | ext:xls | ext:xlsx | ext:ppt | ext:pptx | ext:doc | ext:docx intext:“confidential” | intext:“Not for Public Release” | intext:”internal use only” | intext:“do not distribute” | intext:"strictly private"', description: 'Indexed documents containing sensitive internal keywords.' },
  { id: '17', name: 'SENSITIVE PARAMETERS (PII)', query: 'inurl:email= | inurl:phone= | inurl:name= | inurl:user= | inurl:password= | inurl:token= | inurl:auth= inurl:& site:{target}', description: 'Endpoints passing sensitive user details directly in the URL.' },
  { id: '18', name: 'ADOBE EXPERIENCE MANAGER (AEM)', query: 'inurl:/content/usergenerated | inurl:/content/dam | inurl:/jcr:content | inurl:/libs/granite | inurl:/etc/clientlibs | inurl:/content/geometrixx | inurl:/bin/wcm | inurl:/crx/de site:{target}', description: 'Common paths for AEM misconfigurations.' },
  { id: '19', name: 'DISCLOSED XSS (OpenBugBounty)', query: 'site:openbugbounty.org inurl:reports intext:"{target}"', description: 'Finds already disclosed XSS vulnerabilities for the target.' },
  { id: '20', name: 'GOOGLE GROUPS/FORUMS', query: 'site:groups.google.com "{target}"', description: 'Internal discussions or support leaks on external forums.' },
  { id: '21', name: 'CODE LEAKS & PASTE SITES', query: 'site:pastebin.com "{target}" | site:jsfiddle.net "{target}" | site:codebeautify.org "{target}" | site:codepen.io "{target}" | site:gist.github.com "{target}" | site:replit.com "{target}"', description: 'Searches code-sharing sites for leaked secrets or target endpoints.' },
  { id: '22', name: 'CLOUD STORAGE BUCKETS', query: 'site:s3.amazonaws.com "{target}" | site:blob.core.windows.net "{target}" | site:googleapis.com "{target}" | site:drive.google.com "{target}" | site:dev.azure.com "{target}" | site:onedrive.live.com "{target}" | site:digitaloceanspaces.com "{target}" | site:sharepoint.com "{target}" | site:s3-external-1.amazonaws.com "{target}" | site:s3.dualstack.us-east-1.amazonaws.com "{target}" | site:dropbox.com/s "{target}" | site:docs.google.com inurl:"/d/" "{target}"', description: 'Public cloud storage buckets indexed by Google.' },
  { id: '23', name: 'JFROG ARTIFACTORY / CI', query: 'site:jfrog.io "{target}" | site:jenkins.*.com "{target}" | site:travis-ci.org "{target}"', description: 'Leaks from continuous integration and artifact repositories.' },
  { id: '24', name: 'FIREBASE & VDP', query: 'site:firebaseio.com "{target}" | site:*/security.txt "bounty"', description: 'Finds open Firebase databases or checks for Security.txt policies.' },
  { id: '25', name: 'WP ADMIN / PLUGINS', query: 'intitle:"Index of" inurl:wp-content/plugins site:{target} | inurl:wp-admin site:{target} | inurl:wp-content/uploads site:{target}', description: 'Finds exposed WordPress directories, plugins, and admin panels.' }
];
