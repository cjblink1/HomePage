
import * as pg from 'pg';
import * as TypeMoq from 'typemoq';
import { PostgresConnector, PostgresError } from "../../src/connectors/PostgresConnector";

describe("Postgres Connector", () => {

    var poolMock: TypeMoq.IMock<pg.Pool>;
    var postgresConnector: PostgresConnector;

    beforeEach(() => {
        poolMock = TypeMoq.Mock.ofType(pg.Pool);
    });

    afterEach(() => {
        poolMock = null;
    });

    it("testLinksOfUserNotNull", (done: any) => {
        var queryResult: pg.QueryResult =  {
            command: "", rowCount: 3, rows: ["Nice", "Work", "Connor"], oid: 0
        }
        poolMock.setup(x => x.query(TypeMoq.It.isValue("SELECT * FROM get_links_of_user(u_auth := $1)"),
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

    it("testGetLinksOfUserCorrectValue", (done: any) => {
        var expectedValues = ["Nice", "Work", "Connor"];
        var queryResult: pg.QueryResult =  {
            command: "", rowCount: 3, rows: expectedValues, oid: 0
        };
        poolMock.setup(x => x.query(TypeMoq.It.isValue("SELECT * FROM get_links_of_user(u_auth := $1)"),
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

    it("testGetAllLinksInvalidAuth", (done: any) => {
        var errorResult: PostgresError = {
            error: "User is not defined",
            detail: "1"
        }
        poolMock.setup(x => x.query(TypeMoq.It.isValue("SELECT * FROM get_links_of_user(u_auth := $1)"),
                                      TypeMoq.It.isValue(["invalidAuthParam"])))
                                      .returns(() => Promise.reject(errorResult));
        postgresConnector = new PostgresConnector(poolMock.object);
        postgresConnector.getLinksOfUser("invalidAuthParam")
        .then(links => {
            fail()
            done();
        }).catch((err: PostgresError) => {
            expect(err).not.toBeNull();
            expect(err.error).toBe(errorResult.error);
            expect(err.detail).toBe(errorResult.detail);
            done();
        });
    })
});