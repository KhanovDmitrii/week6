export default function(express, bodyParser, createReadStream, crypto, http){
    const app = express();


    const CORS = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers':'x-test,Content-Type,Accept, Access-Control-Allow-Headers'
        }; 
    

    app
    .use((r, res, next) => { r.res.set(CORS); next(); })
    .use(bodyParser.urlencoded({ extended: true }))
    .get('/sha1/:input', r => {
        const shasum = crypto.createHash('sha1');
        shasum.update(r.params.input);
    
        r.res.send(shasum.digest('hex'));
    })
    
    .get('/login/', (req, res) => res.send('khanovds'))
    .get('/code/', (req, res) => {
        res.set({'Content-Type': 'text/plain; charset=utf-8'});
        createReadStream(import.meta.url.substring(7)).pipe(res);
    })
    ;

    app.all('/req/', (req, res) => {
        const addr = req.method === 'POST' ? req.body.addr : req.query.addr;

        http.get(addr, (r, b = '') => {
            r
            .on('data', d => b += d)
            .on('end', () => res.send(b));
        });
    })
    .get('/hello/', (req, res) => res.send('khanovds'));
     
    return app;

}