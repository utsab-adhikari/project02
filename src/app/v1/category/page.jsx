import React from 'react'
import ManageCategories from './ManageCategories'

export const metadata = {
  title: "Article Categories | Kalamkunja",
  description:
    "Publish your insights on Kalamkunja. Start writing thoughtful articles and share your expertise with the world.",
  alternates: {
    canonical: "https://Kalamkunja.com/v1/category", // adjust if your route is different
  },
};

const CategoriesPage = () => {
  return (
    <ManageCategories/>
  )
}

export default CategoriesPage