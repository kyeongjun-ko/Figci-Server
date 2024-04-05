const request = require("supertest");

const { setupDB } = require("./setupTests");
const server = require("../../app");

setupDB();

beforeEach(() => {
  jest.clearAllMocks();
});

describe("userController 테스트", () => {
  it("로그인한 유저의 정보를 응답으로 보내주어야 합니다.", async () => {
    const mockUserInformation = {
      id: "19990225",
      email: "tjd985@gmail.com",
      handle: "오성오",
      img_url:
        "https://s3-alpha.figma.com/profile/2ef3055e-da87-41cb-b44e-d47b7c502515",
    };

    global.fetch = jest.fn().mockReturnValue(
      Promise.resolve({
        json: () => Promise.resolve(mockUserInformation),
      }),
    );

    const response = await request(server)
      .get("/user")
      .set("accessToken", "userAccessToken");

    expect(response.body.result).toEqual("success");
    expect(response.body.status).toEqual(200);
    expect(response.body.content).toEqual(mockUserInformation);
  });
});
