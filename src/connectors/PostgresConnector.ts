import * as pg from 'pg';

export class PostgresConnector {

    private pool: pg.Pool;
    private client: pg.Client;
    private connected: boolean;

    constructor(pool: pg.Pool) {
        this.pool = pool;
        this.connected = false;
    }

    public connect(): Promise<Boolean>{
        return new Promise((resolve, reject)=> {
            this.pool.connect().then(client => {
                this.client = client;
                this.connected = true;
                resolve();
            });
        });
    }

    public isConnected(): boolean {
        return this.connected;
    }

    public getAllLinks(authParam: string): Promise<any[]>{
        return new Promise((resolve, reject) => {
            this.client.query("SELECT get_all_links(auth := $1)", [authParam])
            .then((result: pg.QueryResult) => {
                resolve(result.rows);
            });
        });
    }
}