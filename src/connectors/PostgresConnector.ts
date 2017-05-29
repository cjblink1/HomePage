import * as pg from "pg";

export class PostgresConnector {

    private pool: pg.Pool;

    constructor(pool: pg.Pool) {
        this.pool = pool;
    }

    public getLinksOfUser(authParam: string): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
            this.pool.query("SELECT * FROM get_links_of_user(u_auth := $1)", [authParam])
            .then(result => resolve(result.rows), reject);
        });
    }

    public createLink(linkName: string, linkUrl: string, authParam: string): Promise<pg.QueryResult> {
        return this.pool.query("SELECT create_link(link_name := $1, link_url := $2, u_auth := $3)",
                               [linkName, linkUrl, authParam]);
    }
}

export interface PostgresError {
    error: string;
    detail: string;
}
