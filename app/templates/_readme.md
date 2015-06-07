# <%= appName %>

<%= description %>

## Develop

Start MAMP, then:

    $ npm run dev

Visit `localhost:8888/<site-name>`

## Build

    $ npm run build

## Deploy

Edit `ftp.json`:

```json
{
  "host": "...",
  "user": "...",
  "password": "...",
  "wpPath": "path/to/wordpress/root",
  "themePath": "wp-content/themes/site-name",
  "mampPath": "/Applications/MAMP/htdocs/mySite"
}
```

Upload the theme:

    $ npm run deploy

Upload the entire WP installation:

    $ npm run deploy-site
