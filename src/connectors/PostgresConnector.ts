import * as pg from "pg";

export class PostgresConnector {

    private pool: pg.Pool;

    constructor(pool: pg.Pool) {
        this.pool = pool;
    }

    public getAllLinks(authParam: string): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.pool.query("SELECT get_all_links(auth := $1)", [authParam])
            .then((result: pg.QueryResult) => {
                resolve(result.rows);
            });
        });
    }
}
