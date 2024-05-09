import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { catalogData } from "../apis";

export const getCatalogPageData = async(categoryId) => {
    const toastId = toast.loading("Loading...");
    let result = [];

    try{
        const responce = await apiConnector("POST", catalogData.CATALOGPAGEDATA_API,
            {categoryId: categoryId}
        );

        if(responce?.data?.success === false){
            throw new Error("Could not fetch category page data");
        }

        result = responce?.data;
        toast.success("Catalog Page Data Fetched Successfully");
        console.log("RESPONCE getCatalogPageData : ", responce);
    }catch(err){
        console.log("Catalog Page API ERROR: ", err);
        toast.error(err.message);
        result = err.responce?.data;
    }

    toast.dismiss(toastId);
    console.log("RESULT getCatalogPageData : ", result);
    return result;
}