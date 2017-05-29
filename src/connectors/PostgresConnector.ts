import * as pg from 'pg';

export class PostgresConnector {

    private pool: pg.Pool;
    private client: pg.Client;
    private connected: boolean;

    constructor(pool: pg.Pool) {
        this.pool = pool;
        this.connected = false;
    }

    public connect(callback: any) {
        this.pool.connect().then(client => {
            this.client = client;
            this.connected = true;
            callback();
        });
    }

    public isConnected(): boolean {
        return this.connected;
    }
}