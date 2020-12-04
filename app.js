export default function init(express, bodyParser, fs, crypto, http) {
    var app = express();
    const NAME = "khanovds";
    const port = process.env.PORT || 80;

    app.use(bodyParser.json());

    app.use(function(req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'x-test,Content-Type,Accept,Access-Control-Allow-Headers');
        next();
    });



    app.get('/login/', function(req, res) {
        res.send(NAME);
    });

    app.get('/code/', function(req, res) {
        res.send(fs.readfileSync("app.js"));
    });

    app.get('/sha1/*', function(req, res) {
        let str = req.url.replace(/\/sha1\/(.*)\/$/i, "$1");
        var shasum = crypto.createHash('sha1');
        shasum.update(str);

        res.send(shasum.digest('hex'));

    });


    app.all('/req/', async function(req, res) {
        let url = "";
        if (req.method == "POST") {
            url = await get_post(req)
        } else {
            url = req.url.replace(/^.*\?(.*)(&|$)/, "$1");
        }
        url = url.replace(/addr=/, "");
        res.send(await r_q(url));

    });

    app.all('*', function(req, res) {
        res.send(NAME);
    });

    return app;

    function r_q(url) {
        return new Promise(r => http.request(url, function(response) {
            var str = '';

            response.on('data', function(chunk) {
                str += chunk;
            });

            response.on('end', function() {
                r(str);
            });
        }).end())
    }

}

function get_post(req) {
    return new Promise(r => {
        let data = "";
        req.on("data", chunk => data += chunk);
        req.on("end", () => r(data))
    });
};