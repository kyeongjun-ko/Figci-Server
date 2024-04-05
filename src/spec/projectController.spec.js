const request = require("supertest");

const { setupDB } = require("./setupTests");
const server = require("../../app");
const Document = require("../models/Document");

jest.mock("../models/Document");

setupDB();

beforeEach(() => {
  jest.clearAllMocks();
});

describe("projectController 테스트", () => {
  describe("[GET] /user", () => {
    it("project-id에 해당하는 프로젝트의 모든 버전정보를 응답으로 보내주어야 합니다.", async () => {
      const mockAllVersion = {
        versions: [
          {
            id: "5476526537",
            created_at: "2024-04-03T10:27:19Z",
            label: "after",
            description: "",
            user: {
              handle: "오성호",
              img_url:
                "https://s3-alpha.figma.com/profile/2ef3055e-da87-41cb-b44e-d47b7c502515",
              id: "893760322388183958",
            },
            thumbnail_url:
              "https://s3-alpha-sig.figma.com/thumbnails/d00d34c8-d995-45d9-b515-9e4b3c680a9a?Expires=1713139200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=GNnvk3xp5-US7IKsQhYJFnIiE2~Q9lSh0tnRwC9NOwFZsIjRCFZmV80NiS8Di-WXop4FoQmaqHWjg5~6ADHf0HNI6AFSSRzSopouvLFAJJX3xZxniLMVqyfY2aHYeWt3zP8Eao-ikPLajRiQAdtlY40f4jiNEC-9znJZ-XFT6oeGv1oBOVCuewcgR0fIQN9YEd2aKfCZhDixUO9OZlgtTxyZkwDgkqBk3L17TUpOP1P~LbCccRHPCixWqnGP85oCz3kWeQv0RyxEx7W0oQpuwkvk8RiaT3AA~3hAkIGXIc4QaafkuPv~z8mXTJO~RYzfCIu7VAg~gJQMnp53wIKA3A__",
          },
          {
            id: "5476497837",
            created_at: "2024-04-03T10:24:15Z",
            label: "before",
            description: "",
            user: {
              handle: "오성호",
              img_url:
                "https://s3-alpha.figma.com/profile/2ef3055e-da87-41cb-b44e-d47b7c502515",
              id: "893760322388183958",
            },
            thumbnail_url:
              "https://s3-alpha-sig.figma.com/thumbnails/97201dc2-1716-4946-a35f-addaa3255cfa?Expires=1713139200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=PfBO23boy2AI6rC4i4Vj5639OxibXbvGuQvd2iyMY7NnwBm1i-Rh1MtnrgCbuKTstK3HuHhpWsiy6XQU7bf2Z5VXZdi9xrpMn9keivWn0Gf3Ep6GhGBqlhKgJHGZVId4KxbmX1lmI67ZrHEtVHt-8uUidpkzp6X0DofDINC9MVrxi4CZNTftZ6~2NrLhfSph2n6GlRiXt7c4WQAa1sFz1jPEf5W~TC7Kba8t8Y-Sf7a6pAPcqclGMrwFdWYfLCoEinENa9iHeIwHH4a4gJitkteLZsBmDAzRMm31DEXwZ79wRPvYAcSOLiirwYZwwCKmwMpr8BxYFGG8U2pozja8bA__",
          },
        ],
      };

      global.fetch = jest.fn().mockReturnValue(
        Promise.resolve({
          json: () => Promise.resolve(mockAllVersion),
        }),
      );

      const response = await request(server)
        .get("/projects/projectId/versions")
        .set("accessToken", "validToken");

      expect(response.body.result).toEqual("success");
      expect(response.body.status).toEqual(200);
      expect(response.body.content).toEqual(mockAllVersion.versions);
    });
  });

  describe("[GET] /:projectId/pages??before-version=before-version&after-version=after-version", () => {
    it("두개의 프로젝트 버전에 공통으로 존재하는 페이지들을 응답으로 보내주어야 합니다.", async () => {
      const mockBeforeSubtree = {
        document: {
          id: "0:0",
          name: "Document",
          type: "DOCUMENT",
          scrollBehavior: "SCROLLS",
          children: [
            {
              id: "0:1",
              name: "00. Style Guide",
              type: "CANVAS",
              scrollBehavior: "SCROLLS",
              children: [],
            },
            {
              id: "71:317",
              name: "01. Mobile",
              type: "CANVAS",
              scrollBehavior: "SCROLLS",
              children: [],
            },
            {
              id: "71:318",
              name: "02. Website",
              type: "CANVAS",
              scrollBehavior: "SCROLLS",
              children: [],
            },
          ],
        },
      };
      const mockAfterSubtree = {
        document: {
          id: "0:0",
          name: "Document",
          type: "DOCUMENT",
          scrollBehavior: "SCROLLS",
          children: [
            {
              id: "0:1",
              name: "00. Style Guide",
              type: "CANVAS",
              scrollBehavior: "SCROLLS",
              children: [],
            },
            {
              id: "71:317",
              name: "01. Mobile",
              type: "CANVAS",
              scrollBehavior: "SCROLLS",
              children: [],
            },
          ],
        },
      };
      const mockCommonPages = [
        { pageId: "0:1", pageName: "00. Style Guide" },
        { pageId: "71:317", pageName: "01. Mobile" },
      ];

      Document.create.mockImplementation(() => {
        const pages = new Map();

        pages.set("0:1", {
          pageId: "0:1",
          name: "00. Style Guide",
          frames: {},
        });
        pages.set("71:317", {
          pageId: "71:317",
          name: "01. Mobile",
          frames: {},
        });

        return { pages };
      });

      Document.create.mockImplementationOnce(() => {
        const pages = new Map();

        pages.set("0:1", {
          pageId: "0:1",
          name: "00. Style Guide",
          frames: {},
        });
        pages.set("71:317", {
          pageId: "71:317",
          name: "01. Mobile",
          frames: {},
        });
        pages.set("71:318", {
          pageId: "71:318",
          name: "02. Website",
          frames: {},
        });

        return { pages };
      });

      global.fetch = jest
        .fn()
        .mockReturnValue(
          Promise.resolve({
            json: () => Promise.resolve(mockBeforeSubtree),
          }),
        )
        .mockReturnValueOnce(
          Promise.resolve({
            json: () => Promise.resolve(mockAfterSubtree),
          }),
        );

      const response = await request(server)
        .get(
          "/projects/projectId/pages?before-version=beforeVersion&after-version=afterVersion",
        )
        .set("accessToken", "validToken");

      expect(response.body.result).toEqual("success");
      expect(response.body.status).toEqual(200);
      expect(response.body.content).toEqual(mockCommonPages);
    });
  });

  describe("[GET] /:projectId/pages??before-version=before-version&after-version=after-version", () => {
    it("두 버전이 공통으로 갖는 페이지를 파싱하여 변경사항이 있는 요소의 차이점을 응답으로 보내주어야 합니다.", async () => {
      const mockDiffingResult = {
        "1:2": {
          type: "MODIFIED",
          nodeId: "1:2",
          frameId: "1:3",
          differenceInformation: {
            "absoluteRenderBounds.y":
              "-121.04399871826172 => -121.05599975585938",
            "absoluteRenderBounds.width":
              "45.122528076171875 => 45.638526916503906",
            "absoluteRenderBounds.height":
              "11.11199951171875 => 11.136001586914062",
            characters: "테스트 전 => 테스트 후",
          },
          position: {
            x: 79,
            y: -123,
            width: 47,
            height: 15,
          },
        },
      };

      Document.findOne.mockImplementation(() => {
        const mockNodes = new Map();
        const mockFrames = new Map();
        const mockPages = new Map();

        mockNodes.set("1:2", {
          nodeId: "1:2",
          type: "TEXT",
          property: {
            absoluteBoundingBox: {
              x: 79,
              y: -123,
              width: 47,
              height: 15,
            },
            absoluteRenderBounds: {
              x: 79.80400085449219,
              y: -121.05599975585938,
              width: 45.638526916503906,
              // eslint-disable-next-line no-loss-of-precision
              height: 11.136001586914062,
            },
            constraints: {
              vertical: "TOP",
              horizontal: "LEFT",
            },
            layoutAlign: "INHERIT",
            layoutGrow: 0,
            layoutSizingHorizontal: "HUG",
            layoutSizingVertical: "HUG",
            fills: [
              {
                blendMode: "NORMAL",
                type: "SOLID",
                color: {
                  r: 0,
                  g: 0,
                  b: 0,
                  a: 1,
                },
              },
            ],
            strokes: [],
            strokeWeight: 1,
            strokeAlign: "OUTSIDE",
            effects: [],
            characters: "테스트 후",
            style: {
              fontFamily: "Inter",
              fontPostScriptName: "Inter-Bold",
              fontWeight: 700,
              textAutoResize: "WIDTH_AND_HEIGHT",
              fontSize: 12,
              textAlignHorizontal: "LEFT",
              textAlignVertical: "TOP",
              letterSpacing: 0,
              lineHeightPx: 14.522727012634277,
              lineHeightPercent: 100,
              lineHeightUnit: "INTRINSIC_%",
            },
            layoutVersion: 4,
            characterStyleOverrides: [],
            lineTypes: ["NONE"],
            lineIndentations: [0],
          },
        });
        mockFrames.set("1:3", {
          frameId: "1:3",
          name: "Frame 1",
          property: {
            absoluteBoundingBox: {
              x: 69,
              y: -133,
              width: 67,
              height: 35,
            },
            absoluteRenderBounds: {
              x: 69,
              y: -133,
              width: 67,
              height: 35,
            },
            constraints: {
              vertical: "TOP",
              horizontal: "LEFT",
            },
            layoutSizingHorizontal: "HUG",
            layoutSizingVertical: "HUG",
            clipsContent: false,
            background: [],
            fills: [],
            strokes: [],
            strokeWeight: 1,
            strokeAlign: "INSIDE",
            backgroundColor: {
              r: 0,
              g: 0,
              b: 0,
              a: 0,
            },
            layoutMode: "HORIZONTAL",
            itemSpacing: 10,
            counterAxisAlignItems: "CENTER",
            primaryAxisAlignItems: "CENTER",
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 10,
            paddingBottom: 10,
            layoutWrap: "NO_WRAP",
            effects: [],
          },
          nodes: mockNodes,
          _id: {
            $oid: "660e931cdfa91f055128b436",
          },
        });
        mockPages.set("0:1", {
          pageId: "0:1",
          name: "Page 1",
          frames: mockFrames,
          _id: {
            $oid: "660e931cdfa91f055128b435",
          },
        });

        const mockDocument = {
          projectKey: "BnS3yLMf5ASXpGiwfiVeKo",
          versionId: "5486295724",
          pages: mockPages,
          __v: 0,
        };

        return mockDocument;
      });
      Document.findOne.mockImplementationOnce(() => {
        const mockNodes = new Map();
        const mockFrames = new Map();
        const mockPages = new Map();

        mockNodes.set("1:2", {
          nodeId: "1:2",
          type: "TEXT",
          property: {
            absoluteBoundingBox: {
              x: 79,
              y: -123,
              width: 47,
              height: 15,
            },
            absoluteRenderBounds: {
              x: 79.80400085449219,
              y: -121.04399871826172,
              width: 45.122528076171875,
              height: 11.11199951171875,
            },
            constraints: {
              vertical: "TOP",
              horizontal: "LEFT",
            },
            layoutAlign: "INHERIT",
            layoutGrow: 0,
            layoutSizingHorizontal: "HUG",
            layoutSizingVertical: "HUG",
            fills: [
              {
                blendMode: "NORMAL",
                type: "SOLID",
                color: {
                  r: 0,
                  g: 0,
                  b: 0,
                  a: 1,
                },
              },
            ],
            strokes: [],
            strokeWeight: 1,
            strokeAlign: "OUTSIDE",
            effects: [],
            characters: "테스트 전",
            style: {
              fontFamily: "Inter",
              fontPostScriptName: "Inter-Bold",
              fontWeight: 700,
              textAutoResize: "WIDTH_AND_HEIGHT",
              fontSize: 12,
              textAlignHorizontal: "LEFT",
              textAlignVertical: "TOP",
              letterSpacing: 0,
              lineHeightPx: 14.522727012634277,
              lineHeightPercent: 100,
              lineHeightUnit: "INTRINSIC_%",
            },
            layoutVersion: 4,
            characterStyleOverrides: [],
            lineTypes: ["NONE"],
            lineIndentations: [0],
          },
        });
        mockFrames.set("1:3", {
          frameId: "1:3",
          name: "Frame 1",
          property: {
            absoluteBoundingBox: {
              x: 69,
              y: -133,
              width: 67,
              height: 35,
            },
            absoluteRenderBounds: {
              x: 69,
              y: -133,
              width: 67,
              height: 35,
            },
            constraints: {
              vertical: "TOP",
              horizontal: "LEFT",
            },
            layoutSizingHorizontal: "HUG",
            layoutSizingVertical: "HUG",
            clipsContent: false,
            background: [],
            fills: [],
            strokes: [],
            strokeWeight: 1,
            strokeAlign: "INSIDE",
            backgroundColor: {
              r: 0,
              g: 0,
              b: 0,
              a: 0,
            },
            layoutMode: "HORIZONTAL",
            itemSpacing: 10,
            counterAxisAlignItems: "CENTER",
            primaryAxisAlignItems: "CENTER",
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 10,
            paddingBottom: 10,
            layoutWrap: "NO_WRAP",
            effects: [],
          },
          nodes: mockNodes,
          _id: {
            $oid: "660e931bdfa91f055128b430",
          },
        });
        mockPages.set("0:1", {
          pageId: "0:1",
          name: "Page 1",
          frames: mockFrames,
          _id: {
            $oid: "660e931bdfa91f055128b42f",
          },
        });

        const mockDocument = {
          projectKey: "BnS3yLMf5ASXpGiwfiVeKo",
          versionId: "5486284231",
          pages: mockPages,
          __v: 0,
        };

        return mockDocument;
      });

      const response = await request(server).get(
        "/projects/BnS3yLMf5ASXpGiwfiVeKo/pages/0:1?before-version=5486284231&after-version=5486295724",
      );

      expect(response.body.result).toEqual("success");
      expect(response.body.status).toEqual(200);
      expect(response.body.content.differences).toEqual(mockDiffingResult);
    });
  });
});
