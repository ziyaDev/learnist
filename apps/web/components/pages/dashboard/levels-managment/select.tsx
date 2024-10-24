'use client';

import React, { useEffect, useState } from 'react';
import { IconPencilPlus, IconX } from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  ActionIcon,
  Center,
  Combobox,
  Input,
  InputBase,
  Kbd,
  Loader,
  ScrollArea,
  Text,
  useCombobox,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useSession } from '@/supabase/lib/use-auth';
import useSupabase from '@/supabase/lib/use-supabase';
import { tanstackQueryClient } from '@/utils/provider/queries';

const LevelSelect = ({
  value,
  onChange,
}: {
  value?: string;
  onChange: (value: string | null) => void;
}) => {
  const [searched, setSearched] = useState<string>('');
  const { school } = useSession();
  const { data, isLoading } = useQuery({
    queryKey: [school.id, searched, 'levels'],
    queryFn: async () => {
      return await supabase
        .from('levels')
        .select('*')
        .eq('school_id', school.id)
        .ilike('name', `%${searched}%`)
        .then((data) => data.data);
    },
  });
  const supabase = useSupabase();

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const options = (
    <ScrollArea.Autosize type="scroll" mah={200}>
      {data?.map((item) => (
        <Combobox.Option value={`${item.id}`} key={item.id}>
          {item.name}
        </Combobox.Option>
      ))}
    </ScrollArea.Autosize>
  );

  return (
    <Input.Wrapper withAsterisk label="Level">
      <Combobox
        store={combobox}
        withinPortal={false}
        onOptionSubmit={(val) => {
          onChange(val);
          combobox.closeDropdown();
        }}
      >
        <Combobox.Target>
          <InputBase
            component="button"
            type="button"
            pointer
            onClick={() => combobox.toggleDropdown()}
            rightSectionPointerEvents="none"
            rightSection={isLoading ? <Loader size={18} /> : <Combobox.Chevron />}
          >
            {data?.find((s) => s.id === Number(value))?.name || (
              <Input.Placeholder>Pick value</Input.Placeholder>
            )}
          </InputBase>
        </Combobox.Target>

        <Combobox.Dropdown>
          <Combobox.Search
            value={searched}
            rightSection={<Combobox.ClearButton onClear={() => setSearched('')} />}
            onChange={(event) => setSearched(event.currentTarget.value)}
            placeholder="Search specialises"
          />

          <Combobox.Options>
            {isLoading ? <Combobox.Empty>Loading....</Combobox.Empty> : options}

            {data?.length === 0 && !isLoading && (
              <Combobox.Empty>Nothing found here...</Combobox.Empty>
            )}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </Input.Wrapper>
  );
};

export default LevelSelect;
