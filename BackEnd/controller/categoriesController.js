import { getAllCategories } from "../services/categoriesService.js";

export default async function getCategories(req, res) {
  try {
    const categories = await getAllCategories();

    return res.json(categories);

  } catch (error) {
    return res.status(500).json({
      message: "Erro interno"
    });
  }
}