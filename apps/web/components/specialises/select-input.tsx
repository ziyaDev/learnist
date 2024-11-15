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

const SpecializationSelect = ({
  value,
  onChange,
}: {
  value?: string;
  onChange: (value: string | null) => void;
}) => {
  const [searched, setSearched] = useState<string>('');
  const { school } = useSession();
  const { data, isLoading } = useQuery({
    queryKey: [school.id, searched, 'specialises'],
    queryFn: async () => {
      return await supabase
        .from('specialises')
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
  const { mutate, isPending } = useMutation({
    mutationFn: async (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter' && searched) {
        event.preventDefault(); // Prevent form submission
        const { error } = await supabase.from('specialises').insert({
          name: searched,
          school_id: school?.id || '',
        });
        if (error) {
          notifications.show({
            title: 'Error saving specialty',
            message: error.message,
            color: 'red',
          });
        }
        onChange(searched);
        setSearched('');
        combobox.closeDropdown();
      }
    },
    onSuccess: async () => {
      tanstackQueryClient.invalidateQueries({ queryKey: ['specialises', searched, school.id] });
    },
  });

  const options = (
    <ScrollArea.Autosize type="scroll" mah={200}>
      {data?.map((item) => (
        <Combobox.Option value={item.name} key={item.id}>
          {item.name}
        </Combobox.Option>
      ))}
    </ScrollArea.Autosize>
  );

  return (
    <Input.Wrapper label="Specialty">
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
            {value || <Input.Placeholder>Pick value</Input.Placeholder>}
          </InputBase>
        </Combobox.Target>

        <Combobox.Dropdown>
          <Combobox.Search
            value={searched}
            rightSection={
              isPending ? (
                <Loader size={18} />
              ) : (
                <>
                  {searched && !isLoading && data?.length < 1 ? (
                    <ActionIcon variant="subtle">
                      <IconPencilPlus size={18} />
                    </ActionIcon>
                  ) : (
                    <Combobox.ClearButton onClear={() => setSearched('')} />
                  )}
                </>
              )
            }
            onKeyDown={mutate}
            onChange={(event) => setSearched(event.currentTarget.value)}
            placeholder="Search specialises"
          />

          <Combobox.Options>
            {isLoading ? <Combobox.Empty>Loading....</Combobox.Empty> : options}

            {data?.length === 0 && !isLoading && (
              <Combobox.Empty>
                <Text fs="italic">
                  Press
                  <Kbd mx={'xs'}>Enter</Kbd>
                  to submit and save
                </Text>
              </Combobox.Empty>
            )}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </Input.Wrapper>
  );
};

export default SpecializationSelect;
