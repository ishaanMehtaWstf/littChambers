"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Folder,
  FolderOpen,
  CheckCircle,
  Circle,
  Clock,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import type { TodoItem, FileItem, RiskItem } from "../../types/types";
import styles from "./TasksFilesSidebar.module.scss";

interface TasksFilesSidebarProps {
  todos: TodoItem[];
  files: Record<string, string>;
  onFileClick: (file: FileItem) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onSendMessage: (message: string) => void;
}

export const TasksFilesSidebar = React.memo<TasksFilesSidebarProps>(
  ({ todos, files, onFileClick, collapsed, onToggleCollapse, onSendMessage }) => {
    const risks: RiskItem[] = useMemo(() => {
      try {
        const riskPath = Object.keys(files).find((p) => p.toLowerCase().endsWith("risks.json"));
        if (!riskPath) return [];
        const parsed = JSON.parse(files[riskPath]);
        return Array.isArray(parsed) ? (parsed as RiskItem[]) : [];
      } catch (e) {
        return [];
      }
    }, [files]);

    const hasFinalDraft = useMemo(() => {
      return Object.keys(files).some((p) => p.toLowerCase().endsWith("final_draft.md"));
    }, [files]);

    const getTitleBannerClass = useCallback((level: RiskItem["risk_level"]) => {
      switch (level) {
        case "High":
          return styles.titleHigh;
        case "Medium":
          return styles.titleMedium;
        default:
          return styles.titleLow;
      }
    }, []);

    const getLikelihoodPosition = useCallback((likelihood: RiskItem["likelihood"]) => {
      switch (likelihood) {
        case "High":
          return "88%";
        case "Medium":
          return "50%";
        default:
          return "12%";
      }
    }, []);

    const getStatusIcon = useCallback((status: TodoItem["status"]) => {
      switch (status) {
        case "completed":
          return <CheckCircle size={16} className={styles.completedIcon} />;
        case "in_progress":
          return <Clock size={16} className={styles.progressIcon} />;
        default:
          return <Circle size={16} className={styles.pendingIcon} />;
      }
    }, []);

    const groupedTodos = useMemo(() => {
      return {
        pending: todos.filter((t) => t.status === "pending"),
        in_progress: todos.filter((t) => t.status === "in_progress"),
        completed: todos.filter((t) => t.status === "completed"),
      };
    }, [todos]);

    if (collapsed) {
      return (
        <div className={styles.sidebarCollapsed}>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className={styles.toggleButton}
          >
            <ChevronRight size={20} />
          </Button>
        </div>
      );
    }

    return (
      <div className={styles.sidebar}>
        <div className={styles.header}>
          <h2 className={styles.title}>Workspace</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className={styles.toggleButton}
          >
            <ChevronLeft size={20} />
          </Button>
        </div>
        <Tabs defaultValue="tasks" className={styles.tabs}>
          <TabsList className={styles.tabsList}>
            <TabsTrigger value="tasks" className={styles.tabTrigger}>
              Tasks ({todos.length})
            </TabsTrigger>
            <TabsTrigger value="files" className={styles.tabTrigger}>
              Files ({Object.keys(files).length})
            </TabsTrigger>
            <TabsTrigger value="risks" className={styles.tabTrigger}>
              Risks ({risks.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className={styles.tabContent}>
            <ScrollArea className={styles.scrollArea}>
              {todos.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>No tasks yet</p>
                </div>
              ) : (
                <div className={styles.todoGroups}>
                  {groupedTodos.in_progress.length > 0 && (
                    <div className={styles.todoGroup}>
                      <h3 className={styles.groupTitle}>In Progress</h3>
                      {groupedTodos.in_progress.map((todo, index) => (
                        <div key={`in_progress_${todo.id}_${index}`} className={styles.todoItem}>
                          {getStatusIcon(todo.status)}
                          <span className={styles.todoContent}>
                            {todo.content}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {groupedTodos.pending.length > 0 && (
                    <div className={styles.todoGroup}>
                      <h3 className={styles.groupTitle}>Pending</h3>
                      {groupedTodos.pending.map((todo, index) => (
                        <div key={`pending_${todo.id}_${index}`} className={styles.todoItem}>
                          {getStatusIcon(todo.status)}
                          <span className={styles.todoContent}>
                            {todo.content}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {groupedTodos.completed.length > 0 && (
                    <div className={styles.todoGroup}>
                      <h3 className={styles.groupTitle}>Completed</h3>
                      {groupedTodos.completed.map((todo, index) => (
                        <div key={`completed_${todo.id}_${index}`} className={styles.todoItem}>
                          {getStatusIcon(todo.status)}
                          <span className={styles.todoContent}>
                            {todo.content}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="files" className={styles.tabContent}>
            <ScrollArea className={styles.scrollArea}>
              {Object.keys(files).length === 0 ? (
                <div className={styles.emptyState}>
                  <p>No files yet</p>
                </div>
              ) : (
                <div className={styles.fileTree}>
                  {Object.keys(files).map((file) => (
                    <div key={file} className={styles.fileItem}>
                      <div
                        className={styles.fileRow}
                        onClick={() =>
                          onFileClick({ path: file, content: files[file] })
                        }
                      >
                        <FileText size={16} />
                        <span className={styles.fileName}>{file}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="risks" className={styles.tabContent}>
            <ScrollArea className={styles.scrollArea}>
              {risks.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>No risks yet</p>
                  {hasFinalDraft && (
                    <Button
                      onClick={() => onSendMessage("Analyze the risks present in the legal draft")}
                      className={styles.analysisButton}
                    >
                      Risk Analysis
                    </Button>
                  )}
                </div>
              ) : (
                <div className={styles.riskList}>
                  {risks.map((risk, index) => (
                    <div
                      key={`${risk.title}_${index}`}
                      className={`${styles.riskCard} ${risk.is_mitigated ? styles.riskCardResolved : ""}`}
                    >
                      {risk.is_mitigated && (
                        <div className={styles.resolvedRibbon}>Resolved</div>
                      )}

                      <div className={`${styles.titleBanner} ${getTitleBannerClass(risk.risk_level)}`}>
                        <h4 className={`${styles.riskTitle} ${risk.is_mitigated ? styles.riskTitleResolved : ""}`}>
                          {risk.title}
                        </h4>
                      </div>

                      {risk.identified_risks?.length > 0 && (
                        <div className={styles.riskSection}>
                          <div className={styles.sectionTitle}>Identified Risks</div>
                          <div className={styles.cardGrid}>
                            {risk.identified_risks.map((item, i) => (
                              <div key={`ir_${i}`} className={`${styles.riskItemCard} ${getTitleBannerClass(risk.risk_level)}`}>
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {risk.potential_impact && (
                        <div className={styles.riskSection}>
                          <div className={styles.sectionTitle}>Potential Impact</div>
                          <div className={styles.impactCard}>
                            {risk.potential_impact}
                          </div>
                        </div>
                      )}

                      {risk.mitigation_recommendations?.length > 0 && (
                        <div className={styles.riskSection}>
                          <div className={styles.sectionTitle}>Mitigation</div>
                          <div className={styles.cardGrid}>
                            {risk.mitigation_recommendations.map((item, i) => (
                              <div key={`mr_${i}`} className={styles.mitigationCard}>
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className={styles.likelihoodSection}>
                        <div className={styles.sectionTitle}>Likelihood: {risk.likelihood}</div>
                        <div className={styles.likelihoodBar}>
                          <div
                            className={styles.likelihoodIndicator}
                            style={{ left: getLikelihoodPosition(risk.likelihood) }}
                          />
                        </div>
                      </div>

                      {!risk.is_mitigated && (
                        <div className={styles.cardFooter}>
                          <Button
                            size="sm"
                            onClick={() => onSendMessage(`Mitigate the risks present in the section: ${risk.title}`)}
                            className={styles.mitigateButton}
                          >
                            Mitigate
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    );
  },
);

TasksFilesSidebar.displayName = "TasksFilesSidebar";
