import * as pg from "pg";

export class PostgresConnector {

    private pool: pg.Pool;

    constructor(pool: pg.Pool) {
        this.pool = pool;
    }

    public getLinksOfUser(authParam: string): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.pool.query("SELECT * FROM get_links_of_user(u_auth := $1)", [authParam])
            .then((result: pg.QueryResult) => {
                resolve(result.rows);
            }).catch((error) => {
                reject(error);
            });
        });
    }
}

export interface PostgresError {
    error: string;
    detail: string;
}
