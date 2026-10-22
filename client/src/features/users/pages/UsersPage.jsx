import { useEffect, useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { useUsers } from "../hooks/useUsers";
import PageHeader from "../../shared/components/PageHeader";
import Table from "../../shared/components/Table";
import Select from "../../shared/components/Select";
import Badge from "../../shared/components/Badge";
import ErrorMessage from "../../shared/components/ErrorMessage";
import { formatCurrency } from "../../shared/utils/format";

const roles = ["employee", "manager", "admin"];

const UsersPage = () => {
    const { user: me } = useAuth();
    const {
        users,
        loading,
        error,
        updatingId,
        actionError,
        loadUsers,
        changeRole,
        resetActionError,
    } = useUsers();

    const [notice, setNotice] = useState("");

    useEffect(() => {
        resetActionError();
        loadUsers();
    }, [loadUsers, resetActionError]);

    const onRoleChange = async (target, newRole) => {
        if (newRole === target.role) return;

        // ask before the changes that have side effects
        let warning = null;
        if (target.role === "manager") {
            warning = `${target.name} will no longer be a manager. Everyone on their team will be left without a manager. Continue?`;
        } else if (newRole === "admin") {
            warning = `Make ${target.name} an admin? Admins can manage every user.`;
        }
        if (warning && !window.confirm(warning)) return;

        setNotice("");
        try {
            const message = await changeRole(target._id, newRole);
            setNotice(message);
        } catch {
            // the message is already in the store and shown in the red box
        }
    };

    const retry = () => {
        resetActionError();
        loadUsers();
    };

    const columns = [
        {
            key: "user",
            header: "User",
            render: (row) => (
                <div>
                    <p className="font-medium text-ink">{row.name}</p>
                    <p className="text-xs text-ink-muted">{row.email}</p>
                </div>
            ),
        },
        {
            key: "role",
            header: "Role",
            render: (row) => {
                // the server refuses this too, so don't offer it
                if (row._id === me?.id) {
                    return <Badge tone="info">Admin (you)</Badge>;
                }
                return (
                    <div className="w-36">
                        <Select
                            aria-label={`Role of ${row.name}`}
                            value={row.role}
                            disabled={updatingId === row._id}
                            onChange={(e) => onRoleChange(row, e.target.value)}
                        >
                            {roles.map((role) => (
                                <option key={role} value={role}>
                                    {role.charAt(0).toUpperCase() + role.slice(1)}
                                </option>
                            ))}
                        </Select>
                    </div>
                );
            },
        },
        {
            key: "manager",
            header: "Manager",
            render: (row) =>
                row.role === "employee" ? (
                    row.manager?.name ?? <span className="text-ink-muted">Unassigned</span>
                ) : (
                    <span className="text-ink-muted">—</span>
                ),
        },
        {
            key: "baseSalary",
            header: "Salary",
            render: (row) =>
                row.baseSalary > 0 ? (
                    formatCurrency(row.baseSalary)
                ) : (
                    <span className="text-ink-muted">Not set</span>
                ),
        },
    ];

    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Users" subtitle="Manage roles, teams and salaries" />

            {loading && users.length > 0 && (
                <p className="text-sm text-ink-muted" role="status">
                    Refreshing…
                </p>
            )}

            {error && <ErrorMessage message={error} onRetry={loadUsers} />}
            {actionError && <ErrorMessage message={actionError} onRetry={retry} />}

            <Table
                columns={columns}
                rows={users}
                loading={loading && users.length === 0}
                emptyMessage="No users yet"
            />
        </div>
    );
};

export default UsersPage;