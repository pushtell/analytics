import assert from "assert";
import UUID from "node-uuid";
import Analytics from "../src/index.js";

describe("Core", function() {
  let analytics;
  before(function(){
    analytics = new Analytics();
  });
  after(function(){
  });
  it("should run this test", function(){
    console.log("THIS");
  });
});

