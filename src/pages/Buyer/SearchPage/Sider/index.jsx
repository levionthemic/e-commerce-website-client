import { memo, useEffect, useState } from "react";
import { axiosApi } from "../../../../services/UserService";
import { StyledMenu } from "./style";
import "./Sider.scss";

const getLevelKeys = (items1) => {
  const key = {};
  const func = (items2, level = 1) => {
    items2.forEach((item) => {
      if (item.key) {
        key[item.key] = level;
      }
      if (item.children) {
        func(item.children, level + 1);
      }
    });
  };
  func(items1);
  return key;
};

function Sider({ parentCategories, onUpdateCategoryId }) {
  const [categories, setCategories] = useState([]);
  const levelKeys = getLevelKeys(categories);

  const [stateOpenKeys, setStateOpenKeys] = useState([""]);

  useEffect(() => {
    if (categories.length) {
      setStateOpenKeys([
        categories[0].key,
        categories[0].children ? categories[0].children[0].key : "",
      ]);
    }
  }, [categories]);

  const onOpenChange = (openKeys) => {
    const currentOpenKey = openKeys.find(
      (key) => stateOpenKeys.indexOf(key) === -1
    );
    // open
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);
      setStateOpenKeys(
        openKeys
          // remove repeat key
          .filter((_, index) => index !== repeatIndex)
          // remove current level all child
          .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey])
      );
    } else {
      // close
      setStateOpenKeys(openKeys);
    }
  };

  useEffect(() => {
    const categoriesId = parentCategories.map((parentCategory) =>
      parseInt(parentCategory)
    );
    let categories_temp = [];
    Promise.all(
      categoriesId.map((categoryId) =>
        axiosApi(`/api/v1/category/${categoryId}`)
      )
    ).then((responses) => {
      categories_temp = responses.map((res) => res.data.data);
      setCategories(categories_temp);
    });
  }, [parentCategories]);

  const handleClick = (e) => {
    onUpdateCategoryId(parseInt(e.key));
  };

  return (
    <div className="sider-category">
      <h6 className="title">Danh mục liên quan</h6>
      <StyledMenu
        mode="inline"
        // defaultOpenKeys={categories.length ? [categories[0].key] : [""]}
        // openKeys={stateOpenKeys}
        onOpenChange={onOpenChange}
        style={{
          width: "100%",
          fontSize: "12.5px",
          borderRight: 0,
        }}
        items={categories}
        onClick={handleClick}
      />
    </div>
  );
}

export default memo(Sider);
