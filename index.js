// XKaaEi1MAh95VgYk;
// dbUser_3
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://dbUser_3:XKaaEi1MAh95VgYk@cluster0.9a2a2oh.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function dbConnect() {
  try {
    await client.connect();
    console.log("database connected");
  } catch (error) {
    console.log(error.messange, error.name);
  }
}

dbConnect();

const Product = client.db("FoodPanda").collection("products");

// endpoint
app.post("/product", async (req, res) => {
  try {
    const result = await Product.insertOne(req.body);
    if (result.insertedId) {
      res.send({
        success: true,
        message: `successfully created the ${req.body.name} with id ${result.insertedId}`,
      });
    } else {
      res.send({
        success: false,
        message: "couldn't create the product",
      });
    }
  } catch (error) {
    console.log(error.name, error.message);
    res.send({
      success: false,
      error: error.message,
    });
  }
});

app.get("/product", async (req, res) => {
  try {
    const cursor = Product.find({});
    const result = await cursor.toArray();
    res.send({
      success: true,
      message: "Products successfully got",
      data: result,
    });
  } catch (err) {
    console.log(err.name, err.message);
    res.send({
      success: false,
      error: err.message,
    });
  }
});

app.delete("/product/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findOne({ _id: ObjectId(id) });
    if (!product?._id) {
      res.send({
        success: false,
        error: "product doesn't find",
      });
      return;
    }
    const result = await Product.deleteOne({ _id: ObjectId(id) });
    if (result.deletedCount) {
      res.send({
        success: true,
        message: "successfully delete the product",
      });
    } else {
      res.send({
        success: false,
        error: "couldn't delete",
      });
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

app.get("/product/:id", async (req, res) => {
  try {
    const result = await Product.findOne({ _id: ObjectId(req.params.id) });
    res.send({
      success: true,
      data: result,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

app.patch("/product/:id", async (req, res) => {
  console.log("body", req.body);
  try {
    const result = await Product.updateOne(
      { _id: ObjectId(req.params.id) },
      {
        $set: req.body,
      }
    );
    console.log("result", result);
    if (result.matchedCount) {
      res.send({
        success: true,
        message: `successfully update the product ${req.body.name}`,
      });
    } else {
      res.send({
        success: false,
        error: "data not update",
      });
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`server operate with port ${port}`);
});
