import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Recipe.module.css";
import { BsSearchHeart, BsTrash, BsPlusCircle } from "react-icons/bs";

import Preloader from "../preloader/Preloader";

const Recipe = () => {
  const nav = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const size = 9; // 페이지당 항목 수

  // Redux에서 로그인한 사용자 데이터 및 이미지를 가져오기
  const userData = useSelector((state) => state.user.userData);

  // 새로운 레시피 작성 함수
  const addRecipe = useCallback(
    async (newRecipe) => {
      try {
        setIsLoading(true);
        await axios.post("http://localhost:8089/wefam/add-recipe", newRecipe, {
          headers: {
            "Content-Type": "application/json", // 서버가 JSON 형식을 기대할 경우
          },
        });
      } catch (error) {
        console.error("addRecipe 함수 에러 : ", error);
      } finally {
        setIsLoading(false);
      }
    },
    [userData.familyIdx]
  );

  // 레시피 목록을 서버에서 가져오는 함수
  const fetchRecipes = useCallback(async (page) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:8089/wefam/families/1/recipes?page=${page}&size=${size}`
      );
      const newRecipes = response.data.recipes;
      console.log("레시피들", response.data.recipes);
      const totalItems = response.data.totalCount; // 새로운 필드에서 총 항목 수를 가져옴

      setRecipes(newRecipes);
      setTotalPages(Math.ceil(totalItems / size));
    } catch (error) {
      console.error("fetchRecipes 함수 에러 : ", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecipes(currentPage, size);
  }, [currentPage, size, fetchRecipes]);

  // 레시피 삭제
  const deleteRecipes = () => {
    axios
      .delete(
        `http://localhost:8089/wefam//families/${userData.familyIdx}/recipes`,
        {
          data: { recipeIdxs: selectedRecipes },
        }
      )
      .then((response) => {
        alert("레시피가 성공적으로 삭제되었습니다.");
        setSelectedRecipes([]);
        fetchRecipes(0); // 첫 페이지부터 레시피 다시 로드
      })
      .catch((error) => {
        console.error("레시피 삭제 중 오류 발생:", error);
      });
  };

  // 레시피 선택 처리
  const toggleRecipe = (recipeIdx) => {
    setSelectedRecipes((prevSelected) =>
      prevSelected.includes(recipeIdx)
        ? prevSelected.filter((prevIdx) => prevIdx !== recipeIdx) // 변수 이름 충돌 해결
        : [...prevSelected, recipeIdx]
    );
  };

  const toggleAllRecipes = (event) => {
    setSelectedRecipes(
      event.target.checked ? recipes.map((recipe) => recipe.recipeIdx) : []
    );
  };

  // 페이지를 변경하는 함수
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="main">
      {isLoading ? (
        <Preloader isLoading={isLoading} />
      ) : (
        <div className={styles.recipe}>
          <div className={styles.header}>
            <div>
              <div className={styles.title}>
                <span>요리법</span>
              </div>
            </div>
            <div className={styles.controller}>
              <button>
                <BsSearchHeart />
              </button>
              <button>
                <BsTrash />
              </button>
              <button
                onClick={() => {
                  nav("/main/recipe/add");
                }}
              >
                <BsPlusCircle />
              </button>
            </div>
          </div>
          <div className={styles.content}>
            {recipes.length > 0 ? (
              <div className={styles.imageGrid}>
                {recipes.map((recipe) => (
                  <div
                    key={recipe.recipeIdx}
                    className={styles.recipeImgContainer}
                  >
                    <input
                      type="checkbox"
                      className={styles.recipeImgChk}
                      checked={selectedRecipes.includes(recipe.recipeIdx)}
                      onChange={() => toggleRecipe(recipe.recipeIdx)}
                    />
                    <img
                      src={recipe.recipeImage}
                      alt={`img-${recipe.recipeIdx}`}
                      className={styles.recipeImg}
                    />
                    <div className={styles.recipeName}>{recipe.recipeName}</div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <div className={styles.pagination}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              이전
            </button>
            <span>
              {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
            >
              다음
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipe;
