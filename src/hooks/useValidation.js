import { useEffect, useRef } from 'react';
import useWorkflowStore from '../store/useWorkflowStore';
import useValidationStore from '../store/useValidationStore';
import { VALIDATION_RULES } from '../constants/validationRules';

export default function useValidation() {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const setMessages = useValidationStore((s) => s.setMessages);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (nodes.length === 0) {
        setMessages([]);
        return;
      }

      const allMessages = [];
      for (const rule of VALIDATION_RULES) {
        try {
          const violations = rule.check(nodes, edges);
          for (const v of violations) {
            allMessages.push({
              ruleId: v.ruleId || rule.id,
              severity: rule.severity,
              title: rule.title,
              description: v.detail || rule.description,
              affectedNodeIds: v.affectedNodeIds || [],
            });
          }
        } catch (err) {
          console.error(`Validation rule "${rule.id}" failed:`, err);
        }
      }

      setMessages(allMessages);
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [nodes, edges, setMessages]);
}
