import * as functions from "firebase-functions";
import * as express from "express";
import * as admin from "firebase-admin";

// import * as cors from "cors";
// import { validateFirebaseIdToken } from './authMiddleware';

admin.initializeApp();

const budget = express();

interface IExpenseDTO {
  datetime: string;
  cost: string;
  note: string;
  type: string;
}

const firestore = admin.firestore();
const expensesCollection = firestore.collection("Expenses");
const expenseTypeCollection = firestore.collection("ExpensesTypes");
const expenseCategoryCollection = firestore.collection("ExpensesCategories");

budget.post("/CreateExpense", async (req, res) => {
  try {
    const payload = req.body as IExpenseDTO;
    const reference = await expensesCollection.add(payload);
    const snapshot = await reference.get();

    if (snapshot.exists) {
      res.json({ id: snapshot.id, ...snapshot.data() });
    } else {
      res.status(404).send("No document found with the provided ID");
    }
  } catch (error) {
    res.status(500).send("Error creating document");
  }
});

budget.get("/GetExpenses", async (req, res) => {
  try {
    const snapshot = await expensesCollection.get();
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (error) {
    res.status(500).send("Error getting document");
  }
});

// Types
budget.post("/CreateType", async (req, res) => {
  try {
    const types = Array.isArray(req.body) ? req.body : [req.body];
    const results = [];

    for (let type of types) {
      const docRef = await expenseTypeCollection.add({ name: type });

      const doc = await docRef.get();

      if (doc.exists) {
        results.push({ id: doc.id, ...doc.data() });
      } else {
        throw new Error("Document does not exist");
      }
    }
    res.json(results);
  } catch (error) {
    res.status(500).send("Error creating document(s)");
  }
});

budget.get("/GetTypes", async (req, res) => {
  try {
    const snapshot = await expenseTypeCollection.get();
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (error) {
    res.status(500).send("Error getting document");
  }
});

// Types
budget.post("/CreateCategory", async (req, res) => {
  try {
    const categories = Array.isArray(req.body) ? req.body : [req.body];
    const results = [];

    for (let category of categories) {
      const docRef = await expenseCategoryCollection.add({ name: category });

      const doc = await docRef.get();

      if (doc.exists) {
        results.push({ id: doc.id, ...doc.data() });
      } else {
        throw new Error("Document does not exist");
      }
    }
    res.json(results);
  } catch (error) {
    res.status(500).send("Error creating document(s)");
  }
});

budget.get("/GetCategories", async (req, res) => {
  try {
    const snapshot = await expenseCategoryCollection.get();
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (error) {
    res.status(500).send("Error getting document");
  }
});

exports.Budget = functions.https.onRequest(budget);
