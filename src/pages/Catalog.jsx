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
    const [active, setActive] = useState(1);

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
    <div className="box-content bg-richblack-800 px-4">
        
        <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
            <p className="text-sm text-richblack-300">{`Home / Catalog / `}<span className="text-yellow-25">{catalogPageData?.data?.selectedCategory?.name}</span></p>
            <p className="text-3xl text-richblack-5">{catalogPageData?.data?.selectedCategory?.name}</p>
            <p className="max-w-[870px] text-richblack-200">{catalogPageData?.data?.selectedCategory?.description}</p>
        </div>

        <div>
            {/* Section 1 */}
            <div className="mx-auto box-content w-full max-w-maxContentTab px-4 lg:max-w-maxContent">
                <div className="section_heading text-white mt-[-50px]">Course to get you started</div>
                <div className="my-4 flex border-b border-b-richblack-600 text-sm">
                    <p
                        className={`px-4 py-2 ${
                        active === 1
                            ? "border-b border-b-yellow-25 text-yellow-25"
                            : "text-richblack-50"
                        } cursor-pointer`}
                        onClick={() => setActive(1)}
                    >Most Popular</p>
                    <p
                        className={`px-4 py-2 ${
                        active === 2
                            ? "border-b border-b-yellow-25 text-yellow-25"
                            : "text-richblack-50"
                        } cursor-pointer`}
                        onClick={() => setActive(2)}
                    >New</p>
                </div>
                <div>
                    <CourseSlider
                        courses={catalogPageData?.data?.selectedCategory?.course}
                    />
                </div>
            </div>

            {/* Section 2 */}
            <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                <div className="section_heading text-white">Top Courses in {catalogPageData?.data?.selectedCategory?.name}</div>
                <div className="py-8">
                    <CourseSlider
                        courses = {catalogPageData?.data?.differentCategories[0]?.course}
                    />
                </div>
            </div>

            {/* Section 3 */}
            <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 lg:max-w-maxContent">
                <div className="section_heading text-white">Frequently Bought</div>
                <div className="py-8">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {
                            catalogPageData?.data?.topSellingCourse?.slice(0, 4)?.map((course, index) => (
                                // eslint-disable-next-line
                                <Course_Card course = {course} key = {index} height = {`h-[400px]`}/>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
        <hr className="text-richblack-700"/>
        <Footer/>
    </div>
  )
}

export default Catalog
