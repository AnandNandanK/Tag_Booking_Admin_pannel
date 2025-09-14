import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { UpdateCountries } from "../../../services/operations/location/country";
import { FiX } from "react-icons/fi"; // ✅ cross icon
import { ImSpinner3 } from "react-icons/im";

const fields = [
  {
    label: "Name",
    name: "name",
    placeholder: "Enter country name",
    type: "text",
  },
  {
    label: "Code",
    name: "code",
    placeholder: "Enter country code",
    type: "text",
  },
  {
    label: "Phone Code",
    name: "phoneCode",
    placeholder: "Enter phone code",
    type: "text",
  },
  // {
  //   label: "Active",
  //   name: "active",
  //   placeholder: "Select status",
  //   type: "select",
  // },
];

interface Props {
  setEditOpen: (value: boolean) => void;
  editCountryId:number | null
}

type CreateCountryProps = {
  name: string;
  code: string;
  phoneCode: number;
  active: string ;
};



export default function UpdateCountry({ setEditOpen,editCountryId }: Props) {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.country.loading);
  
  const countryData = useAppSelector((state) => state.country.data?.content);

  const filteredCountry=countryData?.find((item)=>{
   return item.id===editCountryId
  })

//  console.log(filteredCountry);


  const [formData, setFormData] = useState({
    name: filteredCountry?.name || "",
    code: filteredCountry?.code ||"",
    phoneCode: filteredCountry?.phoneCode.toLocaleString() || "",
    active:filteredCountry?.active.toString() || "true",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  console.log(formData);
  await dispatch(UpdateCountries({formData,editCountryId})); 
  setEditOpen(false); 
};


  
  return (
    <div className="relative bg-white h-full w-full p-6 rounded-md">
      {/* ✅ Close Button */}
      <button
        type="button"
        onClick={() => setEditOpen(false)}
        className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
      >
        <FiX size={22} />
      </button>

      <p className="text-2xl text-blue-400 text-center font-bold">
       Update Country
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-4/6 mx-auto mt-6"
      >
        {fields.map((field) => (
          <div key={field.name} className="flex items-center gap-4 text-black">
            <label className="w-32 text-left font-semibold">
              {field.label}:
            </label>

            {field.type === "select" ? (
              <select
                name={field.name}
                value={formData[field.name as keyof CreateCountryProps]}
                onChange={handleChange}
                className="border px-3 py-2 rounded w-full"
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            ) : (
              <input
                required
                type="text"
                name={field.name}
                value={formData[field.name as keyof CreateCountryProps]}
                onChange={handleChange}
                className="border px-3 py-2 rounded w-full uppercase"
                placeholder={field.placeholder}
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="h-10 w-11/12 mx-auto mt-4 font-bold rounded-3xl text-white flex justify-center items-center 
                                bg-blue-400 hover:bg-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {loading ? <ImSpinner3 className="animate-spin" /> : "Update"}
        </button>

      </form>
    </div>
  );
}
