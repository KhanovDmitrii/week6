export default function(express, bodyParser, createReadStream, crypto, http){
    const app = express();
    const NAME = "khanovds";

    const CORS = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers':'x-test,Content-Type,Accept, Access-Control-Allow-Headers'
        }; 
    

    app
    .use((r, res, next) => { r.res.set(CORS); next(); })
    .use(bodyParser.urlencoded({ extended: true }))
    .get('/sha1/:input', r => {
        let shasum = crypto.createHash('sha1');
        shasum.update(req.params.input);
        res.send(shasum.digest('hex'));
    })
    
    .get('/login/', (req, res) => res.send(NAME))
    .get('/code/', (req, res) => {
        res.set({'Content-Type': 'text/plain; charset=utf-8'});
        createReadStream(import.meta.url.substring(7)).pipe(res);
    })
    ;

    app.all('/req/', (req, res) => {
        let url = "";
        if (req.method == "POST") {
            url = await get_post(req);
        } else {
            url = req.url.replace(/^.*\?(.*)(&|$)/, "$1");
        }
        url = url.replace(/addr=/, "");
        res.send(await r_q(url));
    })
    .all('*', (req, res) => res.send(NAME));
     
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