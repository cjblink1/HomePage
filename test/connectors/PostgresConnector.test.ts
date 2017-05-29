
import * as pg from 'pg';
import * as TypeMoq from 'typemoq';
import { PostgresConnector } from "../../src/connectors/PostgresConnector";

describe("Postgres Connector", () => {

    var poolMock: TypeMoq.IMock<pg.Pool>;
    var postgresConnector: PostgresConnector;

    beforeEach(() => {
        poolMock = TypeMoq.Mock.ofType(pg.Pool);
    });

    it("testGetAllLinksNotNull", (done: any) => {
        var queryResult: pg.QueryResult =  {
            command: "", rowCount: 3, rows: ["Nice", "Work", "Connor"], oid: 0
        }
        poolMock.setup(x => x.query(TypeMoq.It.isValue("SELECT get_links_of_user(u_auth := $1)"),
                                      TypeMoq.It.isValue(["validAuthParam"])))
                                      .returns(() => Promise.resolve(queryResult));
        postgresConnector = new PostgresConnector(poolMock.object);
        postgresConnector.getLinksOfUser("validAuthParam")
        .then(links => {
            expect(links).not.toBeNull();
            done();
        }).catch(() => {
            fail();
            done();
        });
    });

    it("testGetAllLinksCorrectValue", (done: any) => {
        var expectedValues = ["Nice", "Work", "Connor"];
        var queryResult: pg.QueryResult =  {
            command: "", rowCount: 3, rows: expectedValues, oid: 0
        };
        poolMock.setup(x => x.query(TypeMoq.It.isValue("SELECT get_links_of_user(u_auth := $1)"),
                                      TypeMoq.It.isValue(["validAuthParam"])))
                                      .returns(() => Promise.resolve(queryResult));
        postgresConnector = new PostgresConnector(poolMock.object);
        postgresConnector.getLinksOfUser("validAuthParam")
        .then(links => {
            for(var i = 0; i < links.length; i++) {
                expect(links[i]).toBe(expectedValues[i]);
            }
            done();
        }).catch(() => {
            fail();
            done();
        });
    });

    // it("testGetAllLinksInvalidAuth", () => {

    // })
});