import React, { useEffect, useState } from 'react'
import Footer from "../components/common/Footer";
import { useParams } from 'react-router-dom';
import { categories } from "../services/apis";
import { apiConnector } from '../services/apiConnector';
import { getCatalogPageData } from '../services/operations/pageAndComponentData';
import Course_Card from '../components/core/Catalog/Course_Card';
import CourseSlider from '../components/core/Catalog/CourseSlider';

const Catalog = () => {

    const { catalogName } = useParams();
    const [catalogPageData, setCatalogPageData] = useState(null);
    const [categoryId, setCategoryId] = useState("");

    // Fetch all categories
    useEffect(() => {
        const getAllCategories = async() => {
            const result = await apiConnector("GET", categories.CATEGORIES_API);
            const category_id = result?.data?.data.filter((category) => category.name.split(" ").join("").toLowerCase() === catalogName)[0]._id;

            setCategoryId(category_id);
            console.log("getAllCategories: ", result);
        };
        getAllCategories();

    }, [catalogName]);

    useEffect(() => {
        const getCategoryDetails = async() => {
            try{
                const res = await getCatalogPageData(categoryId);
                setCatalogPageData(res);
                console.log("getCategoryDetails", res);
                console.log("Category Id: ", categoryId);
                console.log("Catalog Page Details: ", catalogPageData);
            }catch(err){
                console.log(err);
            }
        }

        if(categoryId){
            getCategoryDetails();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoryId]);

  return (
    <div className="text-white">
        
        <div>
            <p>{`Home / Catalog / `}<span>{catalogPageData?.data?.selectedCategory?.name}</span></p>
            <p>{catalogPageData?.data?.selectedCategory?.name}</p>
            <p>{catalogPageData?.data?.selectedCategory?.description}</p>
        </div>

        <div>
            {/* Section 1 */}
            <div>
                <div>Course to get you started</div>
                <div className="flex gap-x-3">
                    <p>Most Popular</p>
                    <p>New</p>
                </div>
                <div>
                    <CourseSlider
                        courses = {catalogPageData?.data?.selectedCategory?.course}
                    />
                </div>
            </div>

            {/* Section 2 */}
            <div>
                <p>Top Courses in {catalogPageData?.data?.selectedCategory?.name}</p>
                <div>
                    <CourseSlider
                        courses = {catalogPageData?.data?.differentCategories[0]?.course}
                    />
                </div>
            </div>

            {/* Section 3 */}
            <div>
                <div>Frequently Bought</div>
                <div className="py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {
                            catalogPageData?.data?.topSellingCourse?.map((course, index) => (
                                // eslint-disable-next-line
                                <Course_Card course = {course} key = {index} height = {`h-[400px]`}/>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>

        <Footer/>
    </div>
  )
}

export default Catalog
