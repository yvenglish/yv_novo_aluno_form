import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update fonts
html = html.replace(
    '<link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap\" rel=\"stylesheet\" />',
    '<link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap\" rel=\"stylesheet\" />'
)

# 2. Update logo
html = html.replace(
    '<img src=\"assets/logo-yv-white.png\" alt=\"YV English\" class=\"brand-logo\" />',
    '<img src=\"assets/logo-circular.png\" alt=\"YV English\" class=\"brand-logo circular-logo\" />'
)

# 3. Create the new form content
wizard_html = '''
        <div class=\"wizard-progress\">
          <div class=\"progress-info\">
            <span class=\"step-text\">Passo <strong id=\"current-step-num\">1</strong> de <strong>5</strong></span>
          </div>
          <div class=\"progress-track\">
            <div class=\"progress-fill\" id=\"progress-fill\"></div>
          </div>
        </div>

        <div class=\"wizard-steps\">
          <!-- STEP 1 -->
          <div class=\"step form-block active\" data-step=\"0\">
            <h4>1. Informações básicas</h4>

            <div class=\"grid two\">
              <label class=\"field\">
                <span>Nome e sobrenome</span>
                <input type=\"text\" name=\"nome\" required />
              </label>
              <label class=\"field\">
                <span>Data de nascimento</span>
                <input type=\"date\" name=\"data_de_nascimento\" required />
              </label>
            </div>

            <div class=\"grid two\">
              <label class=\"field\">
                <span>WhatsApp</span>
                <input type=\"tel\" name=\"whatsapp\" placeholder=\"(00) 00000-0000\" required />
              </label>
              <label class=\"field\">
                <span>E-mail</span>
                <input type=\"email\" name=\"email\" required />
              </label>
            </div>

            <div class=\"grid two\">
              <label class=\"field\">
                <span>Profissão / área</span>
                <input type=\"text\" name=\"profissao_area\" />
              </label>
              <label class=\"field\">
                <span>Já estudou inglês antes?</span>
                <select name=\"ja_estudou_ingles\" required>
                  <option value=\"\" disabled selected hidden>Selecione</option>
                  <option value=\"Sim\">Sim</option>
                  <option value=\"Não\">Não</option>
                  <option value=\"Um pouco\">Um pouco</option>
                </select>
              </label>
            </div>

            <label class=\"field\">
              <span>Se sim, por quanto tempo e como foi sua experiência?</span>
              <input type=\"text\" name=\"experiencia_com_ingles\" />
            </label>
          </div>

          <!-- STEP 2 -->
          <div class=\"step form-block\" data-step=\"1\">
            <h4>2. Objetivo</h4>

            <label class=\"field\">
              <span>Por que você quer aprender inglês?</span>
              <textarea name=\"objetivo_principal\" rows=\"4\" required></textarea>
            </label>

            <label class=\"field\">
              <span>Onde você mais quer usar o inglês?</span>
              <div class=\"checks\">
                <label><input type=\"checkbox\" name=\"uso_ingles[]\" value=\"Trabalho\" /> Trabalho</label>
                <label><input type=\"checkbox\" name=\"uso_ingles[]\" value=\"Viagens\" /> Viagens</label>
                <label><input type=\"checkbox\" name=\"uso_ingles[]\" value=\"Estudos\" /> Estudos</label>
                <label><input type=\"checkbox\" name=\"uso_ingles[]\" value=\"Morando fora\" /> Morando fora</label>
                <label><input type=\"checkbox\" name=\"uso_ingles[]\" value=\"Conversação\" /> Conversação</label>
                <label><input type=\"checkbox\" name=\"uso_ingles[]\" value=\"Outro\" /> Outro</label>
              </div>
            </label>

            <label class=\"field\">
              <span>Em quanto tempo você gostaria de ver evolução?</span>
              <input type=\"text\" name=\"tempo_para_evolucao\" placeholder=\"Ex.: 3 meses, 6 meses, sem pressa...\" />
            </label>
          </div>

          <!-- STEP 3 -->
          <div class=\"step form-block\" data-step=\"2\">
            <h4>3. Dificuldades</h4>

            <label class=\"field\">
              <span>Você sente que:</span>
              <div class=\"checks\">
                <label><input type=\"checkbox\" name=\"sente_que[]\" value=\"Não sabe por onde começar\" /> não sabe por onde começar</label>
                <label><input type=\"checkbox\" name=\"sente_que[]\" value=\"Entende, mas não fala\" /> entende, mas não fala</label>
                <label><input type=\"checkbox\" name=\"sente_que[]\" value=\"Esquece rápido\" /> esquece rápido</label>
                <label><input type=\"checkbox\" name=\"sente_que[]\" value=\"Não entende quando escuta\" /> não entende quando escuta</label>
                <label><input type=\"checkbox\" name=\"sente_que[]\" value=\"Tem vergonha de falar\" /> tem vergonha de falar</label>
              </div>
            </label>
          </div>

          <!-- STEP 4 -->
          <div class=\"step form-block\" data-step=\"3\">
            <h4>4. Interesses</h4>

            <label class=\"field\">
              <span>O que você gosta de assistir?</span>
              <input type=\"text\" name=\"o_que_gosta_de_assistir\" placeholder=\"séries, filmes, YouTube...\" />
            </label>

            <label class=\"field\">
              <span>Tem algum universo que você gosta muito?</span>
              <input type=\"text\" name=\"universos_de_interesse\" placeholder=\"Harry Potter, futebol, moda, tecnologia...\" />
            </label>

            <div class=\"grid two\">
              <label class=\"field\">
                <span>Quais são seus hobbies?</span>
                <input type=\"text\" name=\"hobbies\" />
              </label>

              <label class=\"field\">
                <span>Quem você acompanha?</span>
                <input type=\"text\" name=\"quem_acompanha\" placeholder=\"artistas, criadores, jogadores...\" />
              </label>
            </div>
          </div>

          <!-- STEP 5 -->
          <div class=\"step form-block\" data-step=\"4\">
            <h4>5. Personalização</h4>

            <label class=\"field\">
              <span>Se eu pudesse montar aulas totalmente personalizadas para você, o que gostaria de ver nelas?</span>
              <textarea name=\"aulas_personalizadas\" rows=\"4\"></textarea>
            </label>

            <label class=\"field\">
              <span>Tem algum tema que você gostaria muito de aprender em inglês?</span>
              <textarea name=\"tema_que_gostaria\" rows=\"3\"></textarea>
            </label>
          </div>
        </div>

        <div class=\"wizard-actions\">
          <button type=\"button\" class=\"btn-prev ghost\" id=\"btn-prev\" style=\"display: none;\">← Voltar</button>
          <button type=\"button\" class=\"btn-next primary\" id=\"btn-next\">Avançar →</button>
          <button type=\"submit\" class=\"submit-btn primary\" id=\"btn-submit\" style=\"display: none;\">Finalizar e Enviar</button>
        </div>

        <p id=\"result\" class=\"result-message\"></p>
'''

start_idx = html.find('<div class=\"form-block\">')
end_idx = html.find('</form>')

if start_idx != -1 and end_idx != -1:
    html = html[:start_idx] + wizard_html + html[end_idx:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
