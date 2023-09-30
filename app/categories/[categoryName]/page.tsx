import React from "react";

function CategoryPage(props: any) {
  const { categoryName } = props.params.categoryName;
  console.log(props.params.categoryName);
  return <div></div>;
}

export default CategoryPage;
