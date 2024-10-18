'use client'
import { createClient } from "@/supabase/lib/client";
import { Combobox, InputBase, Loader, useCombobox, Text, Input } from "@mantine/core";
import { useEffect, useState } from "react";





const SpecializationSelect = ({ value, onChange }: { value?: string, onChange: (value: string | null) => void }) => {
   const [searched, setSearched] = useState<string>('')
   const [loading, setLoading] = useState(false);
   const [data, setData] = useState<{ value: string; label: string; }[]>([]);

   const supabase = createClient();

   const combobox = useCombobox({
      onDropdownClose: () => combobox.resetSelectedOption(),
   });
   useEffect(() => {
      const getAsyncData = async () => {
         setLoading(true);
         await supabase.from("specialises").select('*').eq('name', searched)
            .then(({ data }) => {
               if (data) setData([...data.map((item) => ({ value: item.name, label: item.name })), { value: searched, label: "" }]);
               setLoading(false);
               combobox.resetSelectedOption();
            });
      }
      getAsyncData()

   }, [searched])

   const options = data.filter((item) => item.value.trim() !== "").map((item) => (
      <Combobox.Option value={item.value} key={item.value}>
         {item.value}
      </Combobox.Option>
   ));

   return <Input.Wrapper label="Specialty" >
      <Combobox

         store={combobox}
         withinPortal={true}
         onOptionSubmit={(val) => {
            onChange(val);
            combobox.closeDropdown();
         }}


      >
         <Combobox.Target>
            <InputBase
               onChange={(event) => {
                  combobox.openDropdown();
                  combobox.updateSelectedOptionIndex();
                  setSearched(event.currentTarget.value);
               }}
               value={searched}
               onClick={() => combobox.openDropdown()}
               onFocus={() => combobox.openDropdown()}
               onBlur={() => {
                  combobox.closeDropdown();
                  setSearched(value || '');
               }}
               pointer
               rightSection={loading ? <Loader size={18} /> : <Combobox.Chevron />}
               rightSectionPointerEvents="none"
            />
         </Combobox.Target>

         <Combobox.Dropdown>
            <Combobox.Options>
               {loading ? <Combobox.Empty>Loading....</Combobox.Empty> : options}
               {data.filter((item) => item.value.trim() !== "").length === 0 && !loading && <Combobox.Empty>No results found</Combobox.Empty>}
            </Combobox.Options>
         </Combobox.Dropdown>
      </Combobox>
   </Input.Wrapper>



}

export default SpecializationSelect