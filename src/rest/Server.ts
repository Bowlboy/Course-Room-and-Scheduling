/**
 * This is the REST entry point for the project.
 * Restify is configured here.
 */

import restify = require('restify');

import Log from "../Util";
import {InsightResponse} from "../controller/IInsightFacade";
import InsightFacade from "../controller/InsightFacade";

/**
 * This configures the REST endpoints for the server.
 */

var IF : InsightFacade;

export default class Server {

    private port: number;
    private rest: restify.Server;

    constructor(port: number) {
        Log.info("Server::<init>( " + port + " )");
        this.port = port;
    }

    /**
     * Stops the server. Again returns a promise so we know when the connections have
     * actually been fully closed and the port has been released.
     *
     * @returns {Promise<boolean>}
     */
    public stop(): Promise<boolean> {
        Log.info('Server::close()');
        let that = this;
        return new Promise(function (fulfill) {
            that.rest.close(function () {
                fulfill(true);
            });
        });
    }

    /**
     * Starts the server. Returns a promise with a boolean value. Promises are used
     * here because starting the server takes some time and we want to know when it
     * is done (and if it worked).
     *
     * @returns {Promise<boolean>}
     */
    public start(): Promise<boolean> {
        let that = this;
        return new Promise(function (fulfill, reject) {
            try {
                Log.info('Server::start() - start');

                that.rest = restify.createServer({
                    name: 'insightUBC'
                });

                IF = new InsightFacade();

                that.rest.use(restify.bodyParser({mapParams: true, mapFiles: true}));

                that.rest.get('/', function (req: restify.Request, res: restify.Response, next: restify.Next) {
                    res.send(200);
                    return next();
                });

                // provides the echo service
                // curl -is  http://localhost:4321/echo/myMessage
                that.rest.get('/echo/:msg', Server.echo);

                // Other endpoints will go here

                that.rest.put('/dataset/:id', Server.add);
                that.rest.del('/dataset/:id', Server.remove);
                that.rest.post('/query', Server.perform);
                that.rest.post('/schedule', Server.schedule);

                that.rest.listen(that.port, function () {
                    Log.info('Server::start() - restify listening: ' + that.rest.url);
                    fulfill(true);
                });

                that.rest.on('error', function (err: string) {
                    // catches errors in restify start; unusual syntax due to internal node not using normal exceptions here
                    Log.info('Server::start() - restify ERROR: ' + err);
                    reject(err);
                });
            } catch (err) {
                Log.error('Server::start() - ERROR: ' + err);
                reject(err);
            }
        });
    }

    // The next two methods handle the echo service.
    // These are almost certainly not the best place to put these, but are here for your reference.
    // By updating the Server.echo function pointer above, these methods can be easily moved.

    public static echo(req: restify.Request, res: restify.Response, next: restify.Next) {
        Log.trace('Server::echo(..) - params: ' + JSON.stringify(req.params));
        try {
            let result = Server.performEcho(req.params.msg);
            Log.info('Server::echo(..) - responding ' + result.code);
            res.json(result.code, result.body);
        } catch (err) {
            Log.error('Server::echo(..) - responding 400');
            res.json(400, {error: err.message});
        }
        return next();
    }

    public static add(req: restify.Request, res: restify.Response, next: restify.Next) {
        //console.log("masuk buffer");
        let dataStr = new Buffer(req.params.body).toString('base64');
        //console.log(dataStr);
        //console.log("masuk add");
        IF.addDataset(req.params.id, dataStr)
            .then(function success(content: any) {
                //console.log('IF success');
                //console.log(content);
                //console.log(content.code);
                //console.log(content.body);
                res.json(content.code,content.body);
                //console.log("then");
                return next();
            })
            .catch(function (err: any) {
                //console.log('IF reject');
                //console.log(err);
                //console.log(err.code);
                //console.log(err.body);
                res.json(err.code,err.body);
                //console.log("catch");
                return next();
            })
    }

    public static remove(req: restify.Request, res: restify.Response, next: restify.Next) {
        //let nama = req.params.id;
        //console.log("masuk rem");
        IF.removeDataset(req.params.id)
            .then(function success(content: any) {
                //console.log("masuk rem then");
                res.json(content.code,content.body);
                return next();
            })
            .catch(function (err: any) {
                //console.log("masuk rem err");
                //console.log(err);
                //console.log(err.code);
                //console.log(err.body);
                res.json(err.code,err.body);
                return next();
            })
    }

    public static perform(req: restify.Request, res: restify.Response, next: restify.Next) {
        console.log("masuk perform");
        //console.log(JSON.parse(req.body));
        console.log(req.body);
        IF.performQuery(req.body)
            .then(function success(content: any) {
                //console.log(content);
                //console.log(content.code);
                //console.log(content.body);
                res.json(content.code,content.body);
                return next();
            })
            .catch(function (err: any) {
                //console.log(err);
                //console.log(err.code);
                //console.log(err.body);
                res.json(err.code,err.body);
                return next();
            })
    }

    public static schedule(req: restify.Request, res: restify.Response, next: restify.Next) {
        console.log("masuk schedule");
        console.log(req.body);
        IF.schedule(req.body)
            .then(function success(content: any) {
                //console.log(content);
                //console.log(content.code);
                //console.log(content.body);
                res.json(content.code,content.body);
                return next();
            })
            .catch(function (err: any) {
                //console.log(err);
                //console.log(err.code);
                //console.log(err.body);
                res.json(err.code,err.body);
                return next();
            })
    }

    public static performEcho(msg: string): InsightResponse {
        if (typeof msg !== 'undefined' && msg !== null) {
            return {code: 200, body: {message: msg + '...' + msg}};
        } else {
            return {code: 400, body: {error: 'Message not provided'}};
        }
    }

}
