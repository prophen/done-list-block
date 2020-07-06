import React, { useState } from "react";
import {
    initializeBlock,
    useBase,
    useRecords,
    useGlobalConfig,
    expandRecord,
    Input,
    Button,
    Box,
    Icon,
} from "@airtable/blocks/ui";
import { twilioConfig } from "./config";

function TodoBlock() {
    const base = useBase();

    const globalConfig = useGlobalConfig();
    const tableId = globalConfig.get("selectedTableId");

    const table = base.getTableByIdIfExists(tableId);
    const records = useRecords(table);

    const tasks = records
        ? records.map((record) => {
              return <Task key={record.id} record={record} table={table} />;
          })
        : null;

    return (
        <div>
            {tasks}
            {table && <AddTaskForm table={table} />}
        </div>
    );
}

function Task({ record, table }) {
    return (
        <Box
            fontSize={4}
            paddingX={3}
            paddingY={2}
            marginRight={-2}
            borderBottom="default"
            display="flex"
            alignItems="center"
        >
            <a
                style={{ cursor: "pointer", flex: "auto", padding: 8 }}
                onClick={() => {
                    expandRecord(record);
                }}
            >
                {record.primaryCellValueAsString || "Unnamed record"}
            </a>
            <TaskDeleteButton table={table} record={record} />
        </Box>
    );
}

function TaskDeleteButton({ table, record }) {
    function onClick() {
        table.deleteRecordAsync(record);
    }

    return (
        <Button
            variant="secondary"
            marginLeft={1}
            onClick={onClick}
            disabled={!table.hasPermissionToDeleteRecord(record)}
        >
            <Icon name="x" style={{ display: "flex" }} />
        </Button>
    );
}

function AddTaskForm({ table }) {
    const [taskName, setTaskName] = useState("");

    function onInputChange(event) {
        setTaskName(event.currentTarget.value);
    }

    async function onSubmit(event) {
        event.preventDefault();
        table.createRecordAsync({
            [table.primaryField.id]: taskName,
        });
        fetch(twilioConfig.ENDPOINT_URI, {
            method: "POST",
            body: JSON.stringify({ msg: taskName }),
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => res.json())
            .catch((error) => console.error("Error", error))
            .then((response) => console.log("Success:", response));

        setTaskName("");
    }

    // check whether or not the user is allowed to create records with values in the primary field.
    // if not, disable the form.
    const isFormEnabled = table.hasPermissionToCreateRecord({
        [table.primaryField.id]: undefined,
    });
    return (
        <form onSubmit={onSubmit}>
            <Box display="flex" padding={3}>
                <Input
                    flex="auto"
                    value={taskName}
                    placeholder="Enter your win or lesson"
                    onChange={onInputChange}
                    disabled={!isFormEnabled}
                />
                <Button
                    variant="primary"
                    marginLeft={2}
                    type="submit"
                    disabled={!isFormEnabled}
                >
                    Add
                </Button>
            </Box>
        </form>
    );
}

initializeBlock(() => <TodoBlock />);
