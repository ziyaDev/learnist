'use client';

import React, { useEffect, useState } from 'react';
import { IconPencilPlus, IconX } from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  ActionIcon,
  Center,
  Combobox,
  Group,
  Input,
  InputBase,
  Kbd,
  Loader,
  ScrollArea,
  Skeleton,
  Text,
  useCombobox,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useSession } from '@/supabase/lib/use-auth';
import useSupabase from '@/supabase/lib/use-supabase';
import { tanstackQueryClient } from '@/utils/provider/queries';
import { Tables } from '@/supabase/database.types';

const ClassSelect = ({
  value,
  onChange,
}: {
  value?: string;
  onChange: (value: string | null) => void;
}) => {
  const [searched, setSearched] = useState<string>('');
  const { school } = useSession();
  const { data, isLoading } = useQuery({
    queryKey: [school.id, searched, 'classs'],
    queryFn: async () => {
      return await supabase
        .from('classes')
        .select('*')
        .eq('school_id', school.id)
        .ilike('name', `%${searched}%`)
        .order("created_at", { ascending: true })
        .limit(20)
        .then((data) => data.data);
    },
  });
  const supabase = useSupabase();

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });


  return (
    <Input.Wrapper withAsterisk label="Class">
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
            placeholder="Search classess"
          />

          <Combobox.Options>
            {isLoading ? <Combobox.Empty>Loading....</Combobox.Empty> :
              <ScrollArea.Autosize type="scroll" mah={200}>
                {data?.map((item) => <SelectOption item={item} />)}
              </ScrollArea.Autosize>
            }

            {data?.length === 0 && !isLoading && (
              <Combobox.Empty>Nothing found here...</Combobox.Empty>
            )}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </Input.Wrapper>
  );
};

const SelectOption = ({ item }: { item: Tables<'classes'> }) => {
  const supabase = useSupabase();
  const { data, isLoading } = useQuery({
    queryKey: ['levels', item.id],
    queryFn: async () => await supabase.from('levels').select('name').eq("id", item.level_id).maybeSingle().then(({ data }) => data)
  })
  return <Combobox.Option value={`${item.id}`} key={item.id}>
    <Group>
      <div>
        <Text fz="sm" fw={500}>
          {item.name}
        </Text>
        <Text fz="xs" opacity={0.6}>
          {
            isLoading ? <Skeleton height={14} radius="xl" /> : ` Level :${data?.name}`
          }

        </Text>
      </div>
    </Group>

  </Combobox.Option>
}

export default ClassSelect;
